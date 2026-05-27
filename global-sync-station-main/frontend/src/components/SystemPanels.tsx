import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'gss:app:settings';

type SavedSettings = {
  require2fa?: boolean;
  emergencyBypass?: boolean;
  theme?: 'light' | 'dark';
  apiBase?: string;
};

function loadSettings(): SavedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SavedSettings;
  } catch (e) {
    return {};
  }
}

function saveSettings(s: SavedSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    // ignore
  }
}

export function SecurityPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [require2fa, setRequire2fa] = useState(false);
  const [emergencyBypass, setEmergencyBypass] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!open) return;
    const s = loadSettings();
    setRequire2fa(!!s.require2fa);
    setEmergencyBypass(!!s.emergencyBypass);
    setSaved(false);
    setNotice('');
  }, [open]);

  function persist(next: Partial<SavedSettings>, message: string) {
    const s = loadSettings();
    saveSettings({ ...s, ...next });
    setNotice(message);
    window.setTimeout(() => setNotice(''), 1400);
  }

  function handleSave() {
    persist({ require2fa, emergencyBypass }, 'Security settings saved');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  }

  function handleEmergencyToggle(next: boolean) {
    setEmergencyBypass(next);
    persist({ emergencyBypass: next }, next ? 'Emergency bypass enabled' : 'Emergency bypass disabled');
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card p-6 rounded-xl glass border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">System Security</h3>
          <button className="text-muted-foreground" onClick={onClose}>Close</button>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={require2fa}
              onChange={(e) => {
                const next = e.target.checked;
                setRequire2fa(next);
                persist({ require2fa: next }, next ? '2FA required' : '2FA relaxed');
              }}
            />
            <span className="text-sm">Require 2FA for admin</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={emergencyBypass} onChange={(e) => handleEmergencyToggle(e.target.checked)} />
            <span className="text-sm">Enable emergency bypass (use with caution)</span>
          </label>
          <div>
            <div className="text-sm text-muted-foreground">Audit logs</div>
            <textarea className="w-full mt-2 p-2 bg-transparent border rounded" rows={6} readOnly defaultValue={"No logs available in demo."} />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="px-3 py-1 rounded bg-primary text-primary-foreground">Save</button>
            {saved && <div className="text-sm text-foreground/80">Saved</div>}
            <button onClick={onClose} className="text-sm text-muted-foreground">Close</button>
          </div>
          {notice && <div className="text-sm text-cyan-300">{notice}</div>}
        </div>
      </div>
    </div>
  );
}

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [apiBase, setApiBase] = useState(import.meta.env.VITE_API_BASE ?? 'http://localhost:8000');
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!open) return;
    const s = loadSettings();
    setTheme(s.theme ?? 'dark');
    setApiBase(s.apiBase ?? (import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'));
    setSaved(false);
    setNotice('');
  }, [open]);

  // Apply theme immediately and persist when it changes
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    const s = loadSettings();
    saveSettings({ ...s, theme });
    setNotice(theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
    window.setTimeout(() => setNotice(''), 1200);
  }, [theme]);

  function handleSave() {
    const s = loadSettings();
    const next: SavedSettings = { ...s, theme, apiBase };
    saveSettings(next);
    setSaved(true);
    setNotice('Settings saved');
    window.setTimeout(() => setSaved(false), 1400);
    window.setTimeout(() => setNotice(''), 1400);
    // apply theme quickly
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card p-6 rounded-xl glass border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Settings</h3>
          <button className="text-muted-foreground" onClick={onClose}>Close</button>
        </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Theme</div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    aria-pressed={theme === 'light'}
                    className={`px-3 py-1 rounded ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-surface-container-highest'}`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    aria-pressed={theme === 'dark'}
                    className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-surface-container-highest'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>
          <div>
            <div className="text-sm text-muted-foreground">API Base</div>
            <input
              className="w-full mt-2 p-2 bg-transparent border rounded"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="px-3 py-1 rounded bg-primary text-primary-foreground">Save</button>
            {saved && <div className="text-sm text-foreground/80">Saved</div>}
            <button onClick={onClose} className="text-sm text-muted-foreground">Close</button>
          </div>
          {notice && <div className="text-sm text-cyan-300">{notice}</div>}
        </div>
      </div>
    </div>
  );
}

export default SecurityPanel;
