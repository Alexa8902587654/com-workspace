# Quick Start: Onboarding Officers Dashboard

Get the dashboard running in your CRM in **5 minutes**.

## 1. Copy the Component (1 min)

Copy `OnboardingOfficersDashboard.tsx` to your project:

```bash
# From your CRM project root
mkdir -p src/components/onboarding
cp OnboardingOfficersDashboard.tsx src/components/onboarding/
```

## 2. Add Route (1 min)

Add to your routing configuration:

```tsx
// src/routes.ts or similar
import OnboardingOfficersDashboard from '@/components/onboarding/OnboardingOfficersDashboard';

const routes = [
  // ... existing routes
  {
    path: '/onboarding/dashboard',
    component: OnboardingOfficersDashboard,
    label: 'Onboarding Dashboard',
  },
];
```

## 3. Add Navigation Link (1 min)

Add to your sidebar:

```tsx
// src/components/Sidebar.tsx
<NavLink to="/onboarding/dashboard">
  <DashboardIcon /> Onboarding Dashboard
</NavLink>
```

## 4. Test It (1 min)

Start your dev server:

```bash
npm run dev
# or
yarn dev
```

Navigate to: `http://localhost:3000/onboarding/dashboard`

You should see the dashboard with mock data loaded.

## 5. Customize Colors (1 min)

Update EXANTE green to your brand color in the component:

Find this line and change the color value:
```tsx
backgroundColor: '#2E7D32', // Change this hex code
```

Or better yet, import from your theme:

```tsx
import { useTheme } from '@mui/material/styles';

export const OnboardingOfficersDashboard: React.FC = () => {
  const theme = useTheme();
  // Use theme.palette.primary.main
};
```

## What You Get

✅ Full dashboard with 4 case queues
✅ KPI summary with 6 metrics
✅ Search and filtering
✅ SLA tracking with color-coded rows
✅ "Assign to me" button for unassigned cases
✅ Collapsible queue sections
✅ Responsive mobile-friendly layout
✅ Mock data ready to replace with real API

## Next Steps

### Option A: Quick Enhancement (15 mins)
1. Customize colors to match your brand
2. Update column names if different
3. Deploy to staging

### Option B: Full Integration (2-4 weeks)
1. Follow the **Implementation Checklist** for detailed steps
2. Create API endpoints for each queue
3. Replace mock data with real API calls
4. Set up real-time updates (polling/WebSocket)
5. Add authentication/role-based access
6. Deploy to production

### Option C: Start Testing (30 mins)
1. Show to stakeholders with mock data
2. Gather feedback on layout/UX
3. Create detailed requirements
4. Begin development

## File Structure After Setup

```
src/
├── components/
│   ├── Sidebar.tsx (updated with new nav link)
│   └── onboarding/
│       └── OnboardingOfficersDashboard.tsx (new)
├── routes.ts (updated with new route)
└── App.tsx
```

## Troubleshooting

**Dashboard not showing?**
- Check browser console for errors
- Verify MUI is installed: `npm list @mui/material`
- Check import path matches your file location

**Styling looks wrong?**
- Ensure your app has MUI ThemeProvider wrapping it
- Check for CSS conflicts

**Need to see mock data structure?**
- Look at the `MOCK_*` variables at the top of the component
- Check `CaseData` interface for required fields

## Support Resources

📄 **Full Integration Guide**: `OnboardingOfficersDashboard.Integration.md`
📋 **Implementation Checklist**: `IMPLEMENTATION_CHECKLIST.md`
💡 **Code Examples**: `OnboardingOfficersDashboard.Examples.tsx`

## Key Features

### KPI Summary
- 6 clickable metrics at the top
- Real-time counters (will connect to API)
- Color-coded by urgency

### 4 Case Queues
1. **Escalated** - Highest priority cases
2. **Pending ONBA** - Cases waiting for action (with SLA tracking)
3. **Under Review** - Cases being processed
4. **Unassigned** - New cases available for pickup

### Filtering
- Search by Application ID or Client name
- Filter by Status
- Filter by SLA state (Normal/Warning/Breach)
- Filter by Ownership (My Cases/Unassigned/All)
- Reset all filters

### SLA Indicators
- Green: < 6 hours (normal)
- Orange: 6-8 hours (warning)
- Red: > 8 hours (breach)

### Actions
- Click case ID to view details (implement in next step)
- "Assign to me" button in Unassigned queue
- Collapse/expand each queue section
- Sort by default order (customizable)

## Example: Using with Your API

Once you're ready to connect real data, here's the pattern:

```tsx
import { useEffect, useState } from 'react';
import OnboardingOfficersDashboard from './OnboardingOfficersDashboard';

export const OnboardingPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual API call
    fetch('/api/onboarding/cases')
      .then(r => r.json())
      .then(data => {
        setCases(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  return <OnboardingOfficersDashboard cases={cases} />;
};
```

## Done! 🎉

Your dashboard is now running. From here:

1. **Show it to stakeholders** - Get feedback
2. **Plan API integration** - Add real data
3. **Add real-time updates** - Keep it fresh
4. **Deploy to production** - Let officers use it daily

Need help? Check the integration guide or examples file.
