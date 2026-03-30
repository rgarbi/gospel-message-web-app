import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import getServerAddress from '../util/serverLocation';
import {
  getAdminSubscribers,
  getAdminSubscriptions,
  getAdminUsers,
  adminPromoteUser,
  adminDemoteUser,
} from '../api/client';

const TABS = [
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'subscribers', label: 'Subscribers' },
  { id: 'users', label: 'Users' },
];

function normalizeList(response) {
  if (Array.isArray(response.object)) {
    return response.object;
  }
  return [];
}

function formatSubscriptionType(v) {
  if (v == null || v === '') {
    return '—';
  }
  if (typeof v === 'string') {
    return v;
  }
  if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
    const keys = Object.keys(v);
    if (keys.length === 1) {
      return keys[0];
    }
  }
  return String(v);
}

function formatIsoDate(value) {
  if (value == null || value === '') {
    return '—';
  }
  const s = typeof value === 'string' ? value : String(value);
  const dt = new Date(s);
  if (Number.isNaN(dt.getTime())) {
    return s;
  }
  return dt.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
}

function compareValues(a, b) {
  const aEmpty = a == null || a === '';
  const bEmpty = b == null || b === '';
  if (aEmpty && bEmpty) {
    return 0;
  }
  if (aEmpty) {
    return 1;
  }
  if (bEmpty) {
    return -1;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    if (a === b) {
      return 0;
    }
    return a ? 1 : -1;
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function sortRows(rows, getValue, dir) {
  const mult = dir === 'asc' ? 1 : -1;
  return [...rows].sort((rowA, rowB) => mult * compareValues(getValue(rowA), getValue(rowB)));
}

function toggleSortKey(setSort, key) {
  setSort(prev => {
    if (prev.key === key) {
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
    }
    return { key, dir: 'asc' };
  });
}

function SortTh({ label, sortKey, sort, onSort, className = '' }) {
  const active = sort.key === sortKey;
  return (
    <th className={`px-4 py-3 ${className}`} scope="col">
      <button
        type="button"
        className="inline-flex items-center gap-1 max-w-full text-left font-medium text-gray-700 hover:text-blue-600"
        onClick={() => onSort(sortKey)}
        aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        <span>{label}</span>
        <span className="shrink-0 text-gray-400 tabular-nums w-4 text-center" aria-hidden>
          {active ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  );
}

export default function Admin() {
  const state = useSelector(s => s.authReducer);
  const token = state.token.token;
  const userId = state.token.user_id;

  const [tab, setTab] = useState('subscriptions');
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pendingUserId, setPendingUserId] = useState(null);

  const [sortSubscriptions, setSortSubscriptions] = useState({
    key: 'subscription_name',
    dir: 'asc',
  });
  const [sortSubscribers, setSortSubscribers] = useState({ key: 'name', dir: 'asc' });
  const [sortUsers, setSortUsers] = useState({ key: 'email_address', dir: 'asc' });

  const sortedSubscriptions = useMemo(() => {
    const { key, dir } = sortSubscriptions;
    const getters = {
      subscription_name: r => r.subscription_name ?? '',
      subscription_email_address: r => r.subscription_email_address ?? '',
      subscription_type: r => formatSubscriptionType(r.subscription_type),
      active: r => (r.active ? 1 : 0),
      subscription_mailing_address_line_1: r => r.subscription_mailing_address_line_1 ?? '',
      subscription_mailing_address_line_2: r => (r.subscription_mailing_address_line_2?.trim() || ''),
      subscription_city: r => r.subscription_city ?? '',
      subscription_state: r => r.subscription_state ?? '',
      subscription_postal_code: r => r.subscription_postal_code ?? '',
      subscription_creation_date: r => {
        const v = r.subscription_creation_date;
        if (v == null) {
          return null;
        }
        const t = typeof v === 'string' ? Date.parse(v) : NaN;
        return Number.isNaN(t) ? String(v) : t;
      },
      subscription_cancelled_on_date: r => {
        const v = r.subscription_cancelled_on_date;
        if (v == null) {
          return null;
        }
        const t = typeof v === 'string' ? Date.parse(v) : NaN;
        return Number.isNaN(t) ? String(v) : t;
      },
      subscription_renewal_date: r => r.subscription_renewal_date ?? '',
    };
    const get = getters[key];
    if (!get || subscriptions.length === 0) {
      return subscriptions;
    }
    return sortRows(subscriptions, get, dir);
  }, [subscriptions, sortSubscriptions]);

  const sortedSubscribers = useMemo(() => {
    const { key, dir } = sortSubscribers;
    const getters = {
      name: r => r.name ?? '',
      email_address: r => r.email_address ?? '',
      user_id: r => r.user_id ?? '',
      stripe_customer_id: r => r.stripe_customer_id ?? '',
    };
    const get = getters[key];
    if (!get || subscribers.length === 0) {
      return subscribers;
    }
    return sortRows(subscribers, get, dir);
  }, [subscribers, sortSubscribers]);

  const sortedUsers = useMemo(() => {
    const { key, dir } = sortUsers;
    const getters = {
      email_address: r => r.email_address ?? '',
      user_id: r => r.user_id ?? '',
      user_group: r => r.user_group ?? '',
    };
    const get = getters[key];
    if (!get || users.length === 0) {
      return users;
    }
    return sortRows(users, get, dir);
  }, [users, sortUsers]);

  const loadData = useCallback(async () => {
    if (!token || !userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const address = getServerAddress();
    const [uRes, subRes, subsRes] = await Promise.all([
      getAdminUsers(address, userId, token),
      getAdminSubscribers(address, userId, token),
      getAdminSubscriptions(address, userId, token),
    ]);

    const parts = [];
    if (uRes.statusCode !== 200) {
      parts.push(`users (${uRes.statusCode})`);
    }
    if (subRes.statusCode !== 200) {
      parts.push(`subscribers (${subRes.statusCode})`);
    }
    if (subsRes.statusCode !== 200) {
      parts.push(`subscriptions (${subsRes.statusCode})`);
    }
    if (parts.length > 0) {
      setError(`Request failed: ${parts.join(', ')}`);
      setLoading(false);
      return;
    }

    setUsers(normalizeList(uRes));
    setSubscribers(normalizeList(subRes));
    setSubscriptions(normalizeList(subsRes));
    setLoading(false);
  }, [token, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePromote = async (targetUserId) => {
    setActionError('');
    setPendingUserId(targetUserId);
    const res = await adminPromoteUser(getServerAddress(), userId, targetUserId, token);
    setPendingUserId(null);
    if (res.statusCode === 200) {
      await loadData();
    } else {
      setActionError('Promote failed. You cannot promote yourself, and the user must exist.');
    }
  };

  const handleDemote = async (targetUserId) => {
    setActionError('');
    setPendingUserId(targetUserId);
    const res = await adminDemoteUser(getServerAddress(), userId, targetUserId, token);
    setPendingUserId(null);
    if (res.statusCode === 200) {
      await loadData();
    } else {
      setActionError('Demote failed.');
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin</h1>
          <p className="text-sm text-gray-600 mt-1">
            Data from admin API routes (all subscriptions, subscribers, and users).
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadData()}
          disabled={loading}
          className="shrink-0 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
          {error}
        </div>
      )}
      {actionError && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
          {actionError}
        </div>
      )}

      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex gap-4 flex-wrap" aria-label="Admin sections">
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {loading && !users.length && !subscribers.length && !subscriptions.length ? (
        <p className="text-gray-600 text-sm">Loading data…</p>
      ) : (
        <>
          {tab === 'subscriptions' && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                  <tr>
                    <SortTh
                      label="Name"
                      sortKey="subscription_name"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                    />
                    <SortTh
                      label="Email"
                      sortKey="subscription_email_address"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                    />
                    <SortTh
                      label="Type"
                      sortKey="subscription_type"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                    />
                    <SortTh
                      label="Active"
                      sortKey="active"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                    />
                    <SortTh
                      label="Address line 1"
                      sortKey="subscription_mailing_address_line_1"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                      className="min-w-[8rem]"
                    />
                    <SortTh
                      label="Address line 2"
                      sortKey="subscription_mailing_address_line_2"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                      className="min-w-[6rem]"
                    />
                    <SortTh
                      label="City"
                      sortKey="subscription_city"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                    />
                    <SortTh
                      label="State"
                      sortKey="subscription_state"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                    />
                    <SortTh
                      label="ZIP"
                      sortKey="subscription_postal_code"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                    />
                    <SortTh
                      label="Created"
                      sortKey="subscription_creation_date"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                      className="whitespace-nowrap"
                    />
                    <SortTh
                      label="Cancelled"
                      sortKey="subscription_cancelled_on_date"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                      className="whitespace-nowrap"
                    />
                    <SortTh
                      label="Renewal"
                      sortKey="subscription_renewal_date"
                      sort={sortSubscriptions}
                      onSort={k => toggleSortKey(setSortSubscriptions, k)}
                      className="whitespace-nowrap"
                    />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                        No subscriptions.
                      </td>
                    </tr>
                  ) : (
                    sortedSubscriptions.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50/80">
                        <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{row.subscription_name}</td>
                        <td className="px-4 py-3 text-gray-700">{row.subscription_email_address}</td>
                        <td className="px-4 py-3 text-gray-700">{formatSubscriptionType(row.subscription_type)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                              row.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {row.active ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-[12rem]">{row.subscription_mailing_address_line_1}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[10rem]">
                          {row.subscription_mailing_address_line_2?.trim()
                            ? row.subscription_mailing_address_line_2
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{row.subscription_city}</td>
                        <td className="px-4 py-3 text-gray-600">{row.subscription_state}</td>
                        <td className="px-4 py-3 text-gray-600">{row.subscription_postal_code}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                          {formatIsoDate(row.subscription_creation_date)}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                          {row.subscription_cancelled_on_date != null
                            ? formatIsoDate(row.subscription_cancelled_on_date)
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {row.subscription_renewal_date ?? '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'subscribers' && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                  <tr>
                    <SortTh
                      label="Name"
                      sortKey="name"
                      sort={sortSubscribers}
                      onSort={k => toggleSortKey(setSortSubscribers, k)}
                    />
                    <SortTh
                      label="Email"
                      sortKey="email_address"
                      sort={sortSubscribers}
                      onSort={k => toggleSortKey(setSortSubscribers, k)}
                    />
                    <SortTh
                      label="User ID"
                      sortKey="user_id"
                      sort={sortSubscribers}
                      onSort={k => toggleSortKey(setSortSubscribers, k)}
                    />
                    <SortTh
                      label="Stripe customer"
                      sortKey="stripe_customer_id"
                      sort={sortSubscribers}
                      onSort={k => toggleSortKey(setSortSubscribers, k)}
                    />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No subscribers.
                      </td>
                    </tr>
                  ) : (
                    sortedSubscribers.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50/80">
                        <td className="px-4 py-3 text-gray-900">{row.name}</td>
                        <td className="px-4 py-3 text-gray-700">{row.email_address}</td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{row.user_id}</td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                          {row.stripe_customer_id ?? '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'users' && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                  <tr>
                    <SortTh
                      label="Email"
                      sortKey="email_address"
                      sort={sortUsers}
                      onSort={k => toggleSortKey(setSortUsers, k)}
                    />
                    <SortTh
                      label="User ID"
                      sortKey="user_id"
                      sort={sortUsers}
                      onSort={k => toggleSortKey(setSortUsers, k)}
                    />
                    <SortTh
                      label="Group"
                      sortKey="user_group"
                      sort={sortUsers}
                      onSort={k => toggleSortKey(setSortUsers, k)}
                    />
                    <th className="px-4 py-3 w-48 font-medium text-gray-700" scope="col">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No users.
                      </td>
                    </tr>
                  ) : (
                    sortedUsers.map(row => {
                      const isAdmin = String(row.user_group).toUpperCase() === 'ADMIN';
                      const isSelf = row.user_id === userId;
                      const busy = pendingUserId === row.user_id;
                      return (
                        <tr key={row.user_id} className="hover:bg-gray-50/80">
                          <td className="px-4 py-3 text-gray-900">{row.email_address}</td>
                          <td className="px-4 py-3 text-gray-600 font-mono text-xs">{row.user_id}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {row.user_group}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {!isAdmin && !isSelf && (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => handlePromote(row.user_id)}
                                  className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                >
                                  {busy ? '…' : 'Promote'}
                                </button>
                              )}
                              {isAdmin && (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => handleDemote(row.user_id)}
                                  className="text-xs font-medium text-amber-700 hover:text-amber-900 disabled:opacity-50"
                                >
                                  {busy ? '…' : 'Demote'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
