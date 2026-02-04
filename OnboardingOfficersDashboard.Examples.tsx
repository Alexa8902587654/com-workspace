/**
 * EXAMPLE USAGE: Onboarding Officers Dashboard
 *
 * This file demonstrates different ways to use and integrate the
 * OnboardingOfficersDashboard component into your CRM application.
 */

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import OnboardingOfficersDashboard from './OnboardingOfficersDashboard';

// ============================================================================
// EXAMPLE 1: Basic Usage (Standalone)
// ============================================================================

export const Example1_BasicUsage = () => {
  return (
    <Box sx={{ backgroundColor: '#F5F5F5' }}>
      <OnboardingOfficersDashboard />
    </Box>
  );
};

// ============================================================================
// EXAMPLE 2: With Real API Integration
// ============================================================================

interface CaseData {
  applicationId: string;
  clientName: string;
  status: 'Pending' | 'New' | 'Processed' | 'Rejected' | 'Failed' | 'Canceled';
  priority: number;
  owner?: string;
}

// Mock API service - replace with actual API calls
const mockApiService = {
  getEscalatedCases: async (): Promise<CaseData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { applicationId: '8861', clientName: 'John Smith', status: 'Pending', priority: 5 },
          { applicationId: '9261', clientName: 'Jane Doe', status: 'New', priority: 5 },
        ]);
      }, 1000);
    });
  },

  getPendingONBACases: async (): Promise<CaseData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { applicationId: '9261', clientName: 'Jane Doe', status: 'New', priority: 5 },
          { applicationId: '8829', clientName: 'Acme Corp', status: 'Processed', priority: 5 },
        ]);
      }, 1000);
    });
  },

  assignCaseToOfficer: async (caseId: string, officerId: string): Promise<boolean> => {
    console.log(`Assigned case ${caseId} to officer ${officerId}`);
    return true;
  },
};

export const Example2_WithApiIntegration = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CaseData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [escalated, pending] = await Promise.all([
          mockApiService.getEscalatedCases(),
          mockApiService.getPendingONBACases(),
        ]);

        // Process data...
        setData([...escalated, ...pending]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return <OnboardingOfficersDashboard />;
};

// ============================================================================
// EXAMPLE 3: With Real-Time Updates (Polling)
// ============================================================================

export const Example3_WithRealTimeUpdates = () => {
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger data refresh
      console.log('Refreshing dashboard data...');
      // Call your API to refresh data
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <Box>
      <OnboardingOfficersDashboard />
      {/* Optional: Add refresh rate selector */}
      <Box sx={{ mt: 2, p: 2, backgroundColor: '#FFF' }}>
        <label>
          Refresh Rate:
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
            style={{ marginLeft: '8px' }}
          >
            <option value={10000}>10 seconds</option>
            <option value={30000}>30 seconds</option>
            <option value={60000}>1 minute</option>
            <option value={300000}>5 minutes</option>
          </select>
        </label>
      </Box>
    </Box>
  );
};

// ============================================================================
// EXAMPLE 4: With WebSocket Integration
// ============================================================================

export const Example4_WithWebSocketIntegration = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket('wss://your-api.com/onboarding/ws');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      // Handle real-time updates
      const data = JSON.parse(event.data);
      console.log('Received update:', data);
      // Update component state with new data
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <Box>
      {!connected && <Alert severity="warning">Real-time connection unavailable</Alert>}
      <OnboardingOfficersDashboard />
    </Box>
  );
};

// ============================================================================
// EXAMPLE 5: With Role-Based Filtering
// ============================================================================

type UserRole = 'officer' | 'compliance' | 'mlro' | 'admin';

interface OnboardingDashboardWithRoleProps {
  userRole: UserRole;
}

export const Example5_WithRoleBasedFiltering: React.FC<OnboardingDashboardWithRoleProps> = ({
  userRole,
}) => {
  const [visibleQueues, setVisibleQueues] = useState<string[]>([]);

  useEffect(() => {
    // Configure visible queues based on role
    const queuesByRole: Record<UserRole, string[]> = {
      officer: ['pending', 'under-review', 'unassigned'],
      compliance: ['escalated', 'pending'],
      mlro: ['escalated'],
      admin: ['escalated', 'pending', 'under-review', 'unassigned'],
    };

    setVisibleQueues(queuesByRole[userRole]);
  }, [userRole]);

  return (
    <Box>
      <OnboardingOfficersDashboard />
      {/* Role indicator */}
      <Box sx={{ mt: 2, p: 1, backgroundColor: '#E8F5E9', borderRadius: '4px' }}>
        Visible queues for {userRole}: {visibleQueues.join(', ')}
      </Box>
    </Box>
  );
};

// ============================================================================
// EXAMPLE 6: With Custom Theme Integration
// ============================================================================

import { ThemeProvider, createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // EXANTE green
    },
    secondary: {
      main: '#1976D2',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export const Example6_WithCustomTheme = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <OnboardingOfficersDashboard />
    </ThemeProvider>
  );
};

// ============================================================================
// EXAMPLE 7: Embedded in Your Platform
// ============================================================================

export const Example7_EmbeddedInPlatform = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar (from your platform) */}
      <Box
        sx={{
          width: '240px',
          backgroundColor: '#263238',
          color: '#FFF',
          p: 2,
          borderRight: '1px solid #455A64',
        }}
      >
        <Box sx={{ mb: 4, fontWeight: 600 }}>Navigation</Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ p: 1, borderRadius: '4px', backgroundColor: '#37474F', cursor: 'pointer' }}>
            Dashboard (Active)
          </Box>
          <Box sx={{ p: 1, borderRadius: '4px', cursor: 'pointer' }}>Reports</Box>
          <Box sx={{ p: 1, borderRadius: '4px', cursor: 'pointer' }}>Settings</Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <OnboardingOfficersDashboard />
      </Box>
    </Box>
  );
};

// ============================================================================
// EXAMPLE 8: With Error Handling & Retry Logic
// ============================================================================

export const Example8_WithErrorHandling = () => {
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setError(null);
    setRetryCount((prev) => prev + 1);
    // Trigger data reload
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert
          severity="error"
          action={
            <button onClick={handleRetry} style={{ marginLeft: '8px' }}>
              Retry (Attempt {retryCount + 1})
            </button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return <OnboardingOfficersDashboard />;
};

// ============================================================================
// EXAMPLE 9: With Performance Optimization (Virtualization)
// ============================================================================

// For large datasets (500+ cases), consider using react-window for virtualization
import { FixedSizeList } from 'react-window';

export const Example9_WithVirtualization = () => {
  // This example shows where to add virtualization for very large datasets
  // The main component would need refactoring to use a virtualized table

  return (
    <Box>
      {/* Note: The main component currently uses standard tables.
          For production with large datasets, consider:

          1. Using react-window for table body virtualization
          2. Implement server-side pagination
          3. Use react-table for advanced table features

          Example library: https://github.com/TanStack/react-table
      */}
      <OnboardingOfficersDashboard />
    </Box>
  );
};

// ============================================================================
// EXAMPLE 10: Complete Integration Template
// ============================================================================

interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
}

interface CompleteIntegrationProps {
  currentUser: CurrentUser;
}

export const Example10_CompleteIntegration: React.FC<CompleteIntegrationProps> = ({
  currentUser,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch data based on user role and ID
        const crmApi = {
          getOfficerCases: (officerId: string) =>
            fetch(`/api/cases?officer=${officerId}`).then((r) => r.json()),
          getEscalatedCases: () => fetch('/api/cases/escalated').then((r) => r.json()),
          // ... other endpoints
        };

        await Promise.all([crmApi.getOfficerCases(currentUser.id), crmApi.getEscalatedCases()]);

        setLastRefresh(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  if (error) {
    return (
      <Alert severity="error">
        {error}
        <button onClick={() => window.location.reload()}>Reload</button>
      </Alert>
    );
  }

  return (
    <Box>
      <OnboardingOfficersDashboard />
      <Box sx={{ p: 1, fontSize: '12px', color: '#999', mt: 2 }}>
        Last updated: {lastRefresh.toLocaleTimeString()} • User: {currentUser.name} ({currentUser.role})
        {loading && ' • Syncing...'}
      </Box>
    </Box>
  );
};

// ============================================================================
// EXPORT EXAMPLES
// ============================================================================

// Use one of these exports as your main implementation
export default Example1_BasicUsage;
