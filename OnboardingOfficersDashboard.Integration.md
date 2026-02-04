# Onboarding Officers Dashboard - Integration Guide

## Overview

The `OnboardingOfficersDashboard` is a standalone React component built with Material-UI (MUI) that provides a comprehensive operational workspace for onboarding officers. It's designed to be easily integrated into your existing CRM frontend application.

## Features

✅ **Real-time KPI Dashboard** - Visual overview of key metrics
✅ **Multiple Case Queues** - Escalated, Pending ONBA, Under Review, Unassigned
✅ **SLA Tracking** - Visual SLA status with color-coded rows
✅ **Search & Filtering** - Global search by Application ID or Client name
✅ **Responsive Design** - Two-column layout for larger screens, stacks on mobile
✅ **Enterprise UI** - Clean fintech design with MUI components
✅ **Action Buttons** - "Assign to me" functionality for unassigned cases
✅ **Collapsible Queues** - Toggle queue visibility

## Installation & Setup

### 1. Copy the Component

Place the `OnboardingOfficersDashboard.tsx` file in your CRM frontend project:

```
src/components/onboarding/OnboardingOfficersDashboard.tsx
```

### 2. Install Dependencies (if not already installed)

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### 3. Import and Use

```tsx
import OnboardingOfficersDashboard from '@/components/onboarding/OnboardingOfficersDashboard';

// In your route/page component
export default function OnboardingPage() {
  return <OnboardingOfficersDashboard />;
}
```

## Component Structure

```
OnboardingOfficersDashboard
├── KPISummary
│   └── 6 clickable metric cards
├── FilterBar
│   ├── Search input
│   ├── Status filter
│   ├── SLA state filter
│   ├── Ownership filter
│   └── Reset button
├── QueueTable (Escalated)
├── QueueTable (Pending ONBA)
├── QueueTable (Under Review)
└── QueueTable (Unassigned)
    └── "Assign to me" buttons
```

## API Integration

The component currently uses mock data. To integrate with real data:

### Step 1: Create a Data Service

```tsx
// src/services/onboardingService.ts
import axios from 'axios';

export const onboardingService = {
  getEscalatedCases: () => axios.get('/api/cases/escalated'),
  getPendingONBACases: () => axios.get('/api/cases/pending-onba'),
  getUnderReviewCases: () => axios.get('/api/cases/under-review'),
  getUnassignedCases: () => axios.get('/api/cases/unassigned'),
  assignCaseToOfficer: (caseId: string, officerId: string) =>
    axios.post(`/api/cases/${caseId}/assign`, { officerId }),
};
```

### Step 2: Update the Component to Use Real Data

Replace the mock data with API calls:

```tsx
import { useEffect, useState } from 'react';
import { onboardingService } from '@/services/onboardingService';

export const OnboardingOfficersDashboard: React.FC = () => {
  const [escalatedCases, setEscalatedCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [escalated, pending, review, unassigned] = await Promise.all([
          onboardingService.getEscalatedCases(),
          onboardingService.getPendingONBACases(),
          onboardingService.getUnderReviewCases(),
          onboardingService.getUnassignedCases(),
        ]);

        setEscalatedCases(escalated.data);
        // ... set other queues
      } catch (error) {
        console.error('Failed to fetch cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Rest of component...
};
```

### Step 3: Implement Real-Time Updates

For real-time updates, add polling or WebSocket support:

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    // Refresh data
    fetchData();
  }, 30000); // Refresh every 30 seconds

  return () => clearInterval(interval);
}, []);
```

## Customization

### Theme/Colors

Update the color values in the component to match your brand:

```tsx
// Change EXANTE green to your brand color
const BRAND_COLOR = '#2E7D32'; // Update this

// Apply to buttons, links, etc.
<Button sx={{ backgroundColor: BRAND_COLOR }} />
```

### Add More Columns to Tables

Update the columns array and renderRow function:

```tsx
// Add a new column
columns={['APPLICATION ID', 'SUMMARY', 'STATUS', 'PRIORITY', 'CUSTOM_FIELD']}

// Add corresponding cell in renderRow
<TableCell sx={{ padding: '12px 16px' }}>
  {caseData.customField}
</TableCell>
```

### Modify KPI Metrics

Add or remove metrics from the KPISummary:

```tsx
const metrics: KPIMetric[] = [
  { label: 'Your New Metric', value: 42, color: '#1976D2' },
  // ... other metrics
];
```

## Mock Data Structure

The component uses this data structure. Ensure your API returns data in this format:

```tsx
interface CaseData {
  applicationId: string;      // Unique case identifier
  clientName: string;         // Name of the client
  status: 'Pending' | 'New' | 'Processed' | 'Rejected' | 'Failed' | 'Canceled';
  priority: number;           // 0-5 priority level
  owner?: string;             // Assigned officer name
  createdAt?: string;         // ISO timestamp
  ageInHours?: number;        // Time in queue (for SLA calculation)
  escalationReason?: string;  // Why case was escalated
  escalationAge?: number;     // Hours since escalation
  startedAt?: string;         // When review started
}
```

## Callback Handlers

The component includes placeholder handlers. Connect them to your backend:

```tsx
const handleAssignCase = (caseData: CaseData) => {
  // Call API to assign case to current officer
  onboardingService.assignCaseToOfficer(
    caseData.applicationId,
    getCurrentOfficerId()
  );
};

const handleKPIClick = (metric: string) => {
  // Navigate to filtered view or detailed report
  console.log('KPI clicked:', metric);
};
```

## Styling & Theme Integration

The component uses inline MUI sx props. To use your app's theme:

```tsx
import { useTheme } from '@mui/material/styles';

export const OnboardingOfficersDashboard: React.FC = () => {
  const theme = useTheme();

  // Use theme colors
  const primaryColor = theme.palette.primary.main;
  // ...
};
```

## Accessibility

The component includes:
- Semantic HTML structure
- Proper table headers with scope
- Clickable regions with appropriate cursor styles
- Color contrast ratios meeting WCAG AA standards
- Keyboard navigation support via native MUI components

## Performance Considerations

- Collapsible sections reduce initial render load
- Sticky table headers for better UX with large datasets
- Memoized filter functions to prevent unnecessary recalculations
- Consider virtualizing long tables (500+ rows) using `react-window`

## Known Limitations

1. **Mock data only** - Replace with real API calls
2. **No pagination** - Add if tables exceed 50 rows
3. **No sorting** - Add table header click handlers for sort
4. **Single officer context** - Mock data assumes "Officer A" is logged in

## Future Enhancements

- [ ] WebSocket real-time updates
- [ ] Advanced sorting and pagination
- [ ] Customizable layout configuration
- [ ] Export to CSV/Excel
- [ ] Chat integration
- [ ] Performance analytics
- [ ] Bulk actions (assign multiple cases)
- [ ] Client change history timeline

## Troubleshooting

**Component not rendering?**
- Check MUI is installed: `npm list @mui/material`
- Verify import path is correct
- Check browser console for errors

**Styling looks off?**
- Ensure MUI theme provider wraps your app: `<ThemeProvider theme={theme}>`
- Check for CSS conflicts with existing styles

**Data not updating?**
- Implement the API integration steps above
- Add console logs to verify data is being fetched
- Check network tab in DevTools

## Support

For questions or issues with the component, check:
1. Integration guide above
2. TypeScript interface definitions in the component
3. Mock data structure for API schema reference
