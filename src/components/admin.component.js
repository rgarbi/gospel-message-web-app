import React, { useCallback, useEffect, useState } from 'react';
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
  { id: 'users', label: 'Users' },
  { id: 'subscribers', label: 'Subscribers' },
  { id: 'subscriptions', label: 'Subscriptions' },
];

function normalizeList(response) {
  if (Array.isArray(response.object)) {
    return response.object;
  }
  return [];
}

export default function Admin() {
  const state = useSelector(s => s.authReducer);
  const token = state.token.token;
  const userId = state.token.user_id;

  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pendingUserId, setPendingUserId] = useState(null);

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
            Data from admin API routes (all users, subscribers, and subscriptions).
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
          {tab === 'users' && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Group</th>
                    <th className="px-4 py-3 w-48">Actions</th>
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
                    users.map(row => {
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

          {tab === 'subscribers' && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Stripe customer</th>
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
                    subscribers.map(row => (
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

          {tab === 'subscriptions' && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Active</th>
                    <th className="px-4 py-3">Subscriber ID</th>
                    <th className="px-4 py-3">Renewal</th>
                    <th className="px-4 py-3">City / State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No subscriptions.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50/80">
                        <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{row.subscription_name}</td>
                        <td className="px-4 py-3 text-gray-700">{row.subscription_email_address}</td>
                        <td className="px-4 py-3 text-gray-700">{row.subscription_type}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                              row.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {row.active ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{row.subscriber_id}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {row.subscription_renewal_date ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {row.subscription_city}, {row.subscription_state}
                        </td>
                      </tr>
                    ))
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
