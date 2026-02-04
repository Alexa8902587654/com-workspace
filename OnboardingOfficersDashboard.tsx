import React, { useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// ============================================================================
// TYPES
// ============================================================================

interface CaseData {
  applicationId: string;
  clientName: string;
  stage: 'Escalated' | 'Pending ONBA' | 'Under Review' | 'Unassigned';
  status: 'Pending' | 'New' | 'Processed' | 'Rejected' | 'Failed' | 'Canceled';
  priority: number;
  owner?: string;
  createdAt?: string;
  ageInHours?: number;
  escalationReason?: string;
  escalationAge?: number;
  escalated: boolean;
  sla: 'normal' | 'warning' | 'breach';
  slaMinutesLeft: number;
  blocked: boolean;
  startedAt?: string;
}


// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ESCALATED_CASES: CaseData[] = [
  {
    applicationId: '8861',
    clientName: 'John Smith',
    stage: 'Escalated',
    status: 'Pending',
    priority: 5,
    owner: 'Officer A',
    escalationReason: 'High-risk profile',
    escalationAge: 2,
    escalated: true,
    sla: 'breach',
    slaMinutesLeft: -120,
    blocked: false,
  },
  {
    applicationId: '9261',
    clientName: 'Jane Doe',
    stage: 'Escalated',
    status: 'New',
    priority: 5,
    owner: 'Officer B',
    escalationReason: 'PEP Match',
    escalationAge: 4,
    escalated: true,
    sla: 'warning',
    slaMinutesLeft: 45,
    blocked: false,
  },
  {
    applicationId: '8829',
    clientName: 'Acme Corp',
    stage: 'Escalated',
    status: 'Processed',
    priority: 5,
    owner: 'Officer A',
    escalationReason: 'Sanctions list flagged',
    escalationAge: 1,
    escalated: true,
    sla: 'normal',
    slaMinutesLeft: 320,
    blocked: false,
  },
  {
    applicationId: '4846',
    clientName: 'Tech Ventures Ltd',
    stage: 'Escalated',
    status: 'Processed',
    priority: 1,
    owner: 'Officer C',
    escalationReason: 'Manual review required',
    escalationAge: 3,
    escalated: true,
    sla: 'normal',
    slaMinutesLeft: 240,
    blocked: true,
  },
];

const MOCK_PENDING_ONBA: CaseData[] = [
  {
    applicationId: '9261',
    clientName: 'Jane Doe',
    stage: 'Pending ONBA',
    status: 'New',
    priority: 5,
    owner: 'Officer A',
    ageInHours: 7.5,
    escalated: false,
    sla: 'warning',
    slaMinutesLeft: 30,
    blocked: false,
  },
  {
    applicationId: '8829',
    clientName: 'Acme Corp',
    stage: 'Pending ONBA',
    status: 'Processed',
    priority: 5,
    owner: 'Officer B',
    ageInHours: 5.2,
    escalated: false,
    sla: 'normal',
    slaMinutesLeft: 180,
    blocked: false,
  },
  {
    applicationId: '3536',
    clientName: 'Global Solutions',
    stage: 'Pending ONBA',
    status: 'Canceled',
    priority: 2,
    owner: 'Officer C',
    ageInHours: 3.8,
    escalated: false,
    sla: 'normal',
    slaMinutesLeft: 240,
    blocked: false,
  },
];

const MOCK_UNDER_REVIEW: CaseData[] = [
  {
    applicationId: '6690',
    clientName: 'Michael Brown',
    stage: 'Under Review',
    status: 'Rejected',
    priority: 4,
    owner: 'Officer A',
    startedAt: '2025-01-23 10:30',
    escalated: false,
    sla: 'normal',
    slaMinutesLeft: 300,
    blocked: false,
  },
  {
    applicationId: '1439',
    clientName: 'Sarah Johnson',
    stage: 'Under Review',
    status: 'Failed',
    priority: 1,
    owner: 'Officer B',
    startedAt: '2025-01-23 09:15',
    escalated: false,
    sla: 'breach',
    slaMinutesLeft: -200,
    blocked: false,
  },
  {
    applicationId: '5948',
    clientName: 'David Lee',
    stage: 'Under Review',
    status: 'Pending',
    priority: 2,
    owner: 'Officer C',
    startedAt: '2025-01-23 08:45',
    escalated: false,
    sla: 'warning',
    slaMinutesLeft: 60,
    blocked: false,
  },
];

const MOCK_UNASSIGNED: CaseData[] = [
  {
    applicationId: '5028',
    clientName: 'Emily Wilson',
    stage: 'Unassigned',
    status: 'Rejected',
    priority: 1,
    createdAt: '2025-01-23 14:20',
    ageInHours: 2,
    escalated: false,
    sla: 'normal',
    slaMinutesLeft: 360,
    blocked: false,
  },
  {
    applicationId: '4600',
    clientName: 'Robert Taylor',
    stage: 'Unassigned',
    status: 'Pending',
    priority: 0,
    createdAt: '2025-01-23 13:45',
    ageInHours: 2.5,
    escalated: false,
    sla: 'normal',
    slaMinutesLeft: 330,
    blocked: false,
  },
  {
    applicationId: '7123',
    clientName: 'Lisa Anderson',
    stage: 'Unassigned',
    status: 'New',
    priority: 3,
    createdAt: '2025-01-23 12:00',
    ageInHours: 4,
    escalated: false,
    sla: 'normal',
    slaMinutesLeft: 240,
    blocked: false,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================


const getSLABackgroundColor = (status: 'normal' | 'warning' | 'breach') => {
  switch (status) {
    case 'breach':
      return 'rgba(211, 47, 47, 0.08)'; // Light red
    case 'warning':
      return 'rgba(245, 124, 0, 0.08)'; // Light orange
    default:
      return 'transparent';
  }
};

const formatSLATimer = (minutes: number): string => {
  if (minutes <= 0) {
    return `🔴 Breached ${Math.abs(minutes)}m ago`;
  } else if (minutes < 120) {
    return `⚠️ ${minutes}m left`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `✓ ${hours}h ${mins}m`;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Processed':
      return '#4CAF50'; // Green
    case 'Pending':
      return '#FF9800'; // Orange
    case 'New':
      return '#1976D2'; // Blue
    case 'Rejected':
      return '#D32F2F'; // Red
    case 'Failed':
      return '#D32F2F'; // Red
    case 'Canceled':
      return '#9E9E9E'; // Grey
    default:
      return '#757575'; // Default grey
  }
};

// ============================================================================
// COMPONENTS
// ============================================================================

interface KPISummaryProps {
  escalated: number;
  pendingONB: number;
  poONB: number;
  onbaQueue: number;
  slaWarning: number;
  slaBreach: number;
  activeFilter?: string | null;
  onKPIClick?: (filterId: string) => void;
}

const KPISummary: React.FC<KPISummaryProps> = ({
  escalated,
  pendingONB,
  poONB,
  onbaQueue,
  slaWarning,
  slaBreach,
  activeFilter,
  onKPIClick,
}) => {
  const kpiCards = [
    { id: 'pending-onb', label: 'Pending ONB', value: pendingONB, color: '#D32F2F' },
    { id: 'po-onb', label: 'PO ONB', value: poONB, color: '#1976D2' },
    { id: 'escalated', label: 'Escalated', value: escalated, color: '#F57C00' },
    { id: 'onba-queue', label: 'ONBA Queue', value: onbaQueue, color: '#4CAF50' },
    { id: 'sla-warning', label: 'SLA Warning', value: slaWarning, color: '#FFC107' },
    { id: 'sla-breach', label: 'SLA Breach', value: slaBreach, color: '#D32F2F' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {kpiCards.map((card) => (
        <Paper
          key={card.id}
          sx={{
            padding: '16px 20px',
            flex: '0 1 auto',
            minWidth: '140px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: '2px solid transparent',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            '&:hover': {
              borderColor: '#2E7D32',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.15)',
            },
            ...(activeFilter === card.id && {
              background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05), rgba(46, 125, 50, 0.02))',
              borderColor: '#2E7D32',
              boxShadow: '0 2px 12px rgba(46, 125, 50, 0.2), inset 0 0 0 1px rgba(46, 125, 50, 0.1)',
            }),
          }}
          onClick={() => onKPIClick?.(card.id)}
        >
          <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
            {card.label}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: card.color,
              fontSize: '24px',
            }}
          >
            {card.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  slaFilter: string;
  onSLAChange: (value: string) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  slaFilter,
  onSLAChange,
  onReset,
}) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <TextField
        placeholder="Search by Application ID or Client name"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#999' }} />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: '250px', backgroundColor: '#FFFFFF' }}
      />

      <FormControl size="small" sx={{ minWidth: '120px', backgroundColor: '#FFFFFF' }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e: any) => onStatusChange(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="New">New</MenuItem>
          <MenuItem value="Processed">Processed</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
          <MenuItem value="Failed">Failed</MenuItem>
          <MenuItem value="Canceled">Canceled</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: '120px', backgroundColor: '#FFFFFF' }}>
        <InputLabel>SLA State</InputLabel>
        <Select
          value={slaFilter}
          label="SLA State"
          onChange={(e: any) => onSLAChange(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="warning">Warning</MenuItem>
          <MenuItem value="breach">Breach</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        size="small"
        onClick={onReset}
        sx={{
          borderColor: '#DDD',
          color: '#666',
          '&:hover': {
            borderColor: '#999',
            backgroundColor: '#F5F5F5',
          },
        }}
      >
        Reset
      </Button>
    </Box>
  );
};

interface QueueTableProps {
  title: string;
  cases: CaseData[];
  columns: string[];
  renderRow: (caseData: CaseData, idx: number) => React.ReactNode;
  defaultExpanded?: boolean;
  onAssignCase?: (caseData: CaseData) => void;
  showAssignButton?: boolean;
}

const QueueTable: React.FC<QueueTableProps> = ({
  title,
  cases,
  columns,
  renderRow,
  defaultExpanded = true,
  onAssignCase,
  showAssignButton = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card
      sx={{
        mb: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #EFEFEF',
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#FAFAFA' },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={cases.length}
            size="small"
            sx={{
              backgroundColor: '#E0E0E0',
              color: '#424242',
              fontWeight: 600,
            }}
          />
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ backgroundColor: '#F5F5F5', position: 'sticky', top: 0 }}>
              <TableRow>
                {columns.map((col: string, idx: number) => (
                  <TableCell
                    key={idx}
                    sx={{
                      fontWeight: 600,
                      color: '#666',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '2px solid #EFEFEF',
                      padding: '12px 16px',
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
                {showAssignButton && (
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: '#666',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      borderBottom: '2px solid #EFEFEF',
                      padding: '12px 16px',
                    }}
                  >
                    Action
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {cases.length > 0 ? (
                cases.map((caseData: CaseData, idx: number) => (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor: getSLABackgroundColor(caseData.sla),
                      '&:hover': { backgroundColor: '#FAFAFA' },
                      cursor: 'pointer',
                      borderBottom: '1px solid #EFEFEF',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {renderRow(caseData, idx)}
                    {showAssignButton && (
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => onAssignCase?.(caseData)}
                          sx={{
                            backgroundColor: '#2E7D32',
                            color: '#FFFFFF',
                            textTransform: 'none',
                            fontSize: '12px',
                            '&:hover': {
                              backgroundColor: '#1B5E20',
                            },
                          }}
                        >
                          Assign to me
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (showAssignButton ? 1 : 0)}
                    sx={{ textAlign: 'center', padding: '24px', color: '#999' }}
                  >
                    No cases found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </Card>
  );
};

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

export const OnboardingOfficersDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [slaFilter, setSLAFilter] = useState('');
  const [kpiFilter, setKPIFilter] = useState<string | null>(null);
  const [assignedCases, setAssignedCases] = useState<CaseData[]>([]);

  // Combine all cases for filtering
  const allCases = [...MOCK_ESCALATED_CASES, ...MOCK_PENDING_ONBA, ...MOCK_UNDER_REVIEW, ...MOCK_UNASSIGNED];

  // KPI filter mapping
  const kpiFilterMap: Record<string, { stage?: string; status?: string; escalated?: boolean; sla?: string; all?: boolean; label: string }> = {
    'pending-onb': { stage: 'Pending ONBA', label: 'Pending ONB Cases' },
    'po-onb': { status: 'Processed', label: 'Post-Onboarding Cases' },
    'escalated': { escalated: true, label: 'Escalated Cases' },
    'onba-queue': { all: true, label: 'All Cases' },
    'sla-warning': { sla: 'warning', label: 'SLA Warning Cases' },
    'sla-breach': { sla: 'breach', label: 'SLA Breach Cases' },
  };

  // Enhanced filter function
  const matchesFilters = (caseData: CaseData): boolean => {
    // Search filter
    const matchesSearch =
      !searchTerm ||
      caseData.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseData.clientName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Status filter
    const matchesStatus = !statusFilter || caseData.status === statusFilter;
    if (!matchesStatus) return false;

    // SLA State filter
    const matchesSLA = !slaFilter || caseData.sla === slaFilter;
    if (!matchesSLA) return false;

    // KPI filter
    if (kpiFilter) {
      const config = kpiFilterMap[kpiFilter];
      if (config.all) return true;
      if (config.stage && caseData.stage !== config.stage) return false;
      if (config.status && caseData.status !== config.status) return false;
      if (config.escalated !== undefined && caseData.escalated !== config.escalated) return false;
      if (config.sla && caseData.sla !== config.sla) return false;
    }

    return true;
  };

  // Get filtered cases
  const filteredCases = allCases.filter(matchesFilters);

  // Get urgent inbox (SLA breach/warning or blocked)
  const urgentCases = allCases.filter(
    (c) => (c.sla === 'breach' || c.sla === 'warning' || c.blocked) && matchesFilters(c)
  );

  // Calculate KPIs
  const escalatedCount = allCases.filter((c) => c.escalated).length;
  const pendingONBCount = allCases.filter((c) => c.stage === 'Pending ONBA').length;
  const poONBCount = allCases.filter((c) => c.status === 'Processed').length;
  const onbaQueueCount = allCases.length;
  const slaWarningCount = allCases.filter((c) => c.sla === 'warning').length;
  const slaBreachCount = allCases.filter((c) => c.sla === 'breach').length;

  const handleKPIClick = (filterId: string) => {
    setKPIFilter(kpiFilter === filterId ? null : filterId);
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSLAFilter('');
    setKPIFilter(null);
  };

  return (
    <Box sx={{ backgroundColor: '#F5F5F5', minHeight: '100vh', p: 3 }}>
      <Box sx={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#212121', mb: 3 }}
          >
            Onboarding Officers Dashboard
          </Typography>

          {/* KPI Summary */}
          <KPISummary
            escalated={escalatedCount}
            pendingONB={pendingONBCount}
            poONB={poONBCount}
            onbaQueue={onbaQueueCount}
            slaWarning={slaWarningCount}
            slaBreach={slaBreachCount}
            activeFilter={kpiFilter}
            onKPIClick={handleKPIClick}
          />
        </Box>

        {/* Filter Status Bar */}
        {kpiFilter && (
          <Box
            sx={{
              background: 'linear-gradient(90deg, #E8F5E9, #F1F8E9)',
              border: '1px solid #81C784',
              borderRadius: '6px',
              p: 2,
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ color: '#1B5E20', fontWeight: 500 }}>
              Filtering by: <strong>{kpiFilterMap[kpiFilter]?.label}</strong>
            </Typography>
            <Button
              size="small"
              onClick={() => setKPIFilter(null)}
              sx={{
                color: '#1B5E20',
                borderColor: '#81C784',
                '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.05)' },
              }}
              variant="outlined"
            >
              Clear Filter
            </Button>
          </Box>
        )}

        {/* Filters */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          slaFilter={slaFilter}
          onSLAChange={setSLAFilter}
          onReset={handleReset}
        />

        {/* Urgent Inbox */}
        {urgentCases.length > 0 && (
          <Card sx={{ mb: 3, backgroundColor: '#FFEBEE', borderLeft: '4px solid #D32F2F' }}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#C62828' }}>
                  🔔 Urgent Inbox
                </Typography>
                <Chip label={urgentCases.length} size="small" sx={{ backgroundColor: '#D32F2F', color: '#FFF' }} />
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: 'rgba(211, 47, 47, 0.1)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#C62828', fontSize: '12px' }}>APP ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#C62828', fontSize: '12px' }}>CLIENT</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#C62828', fontSize: '12px' }}>STATUS</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#C62828', fontSize: '12px' }}>SLA TIMER</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {urgentCases.map((caseData: CaseData, idx: number) => (
                      <TableRow key={idx} sx={{ backgroundColor: 'rgba(211, 47, 47, 0.04)' }}>
                        <TableCell sx={{ padding: '12px 16px', color: '#2E7D32', fontWeight: 600 }}>
                          {caseData.applicationId}
                        </TableCell>
                        <TableCell sx={{ padding: '12px 16px', color: '#666' }}>{caseData.clientName}</TableCell>
                        <TableCell sx={{ padding: '12px 16px' }}>
                          <Chip
                            label={caseData.status}
                            size="small"
                            sx={{
                              backgroundColor: `${getStatusColor(caseData.status)}20`,
                              color: getStatusColor(caseData.status),
                              fontWeight: 500,
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ padding: '12px 16px', color: '#C62828', fontWeight: 600 }}>
                          {formatSLATimer(caseData.slaMinutesLeft)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Card>
        )}

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column - Work Queue */}
          <Grid item xs={12} lg={9}>
            <QueueTable
              title="My Work Queue"
              cases={filteredCases}
              columns={['APPLICATION ID', 'CLIENT', 'STATUS', 'SLA TIMER', 'PRIORITY']}
              renderRow={(caseData: CaseData) => (
                <>
                  <TableCell sx={{ padding: '12px 16px', color: '#2E7D32', fontWeight: 600 }}>
                    {caseData.applicationId}
                  </TableCell>
                  <TableCell sx={{ padding: '12px 16px', color: '#666' }}>{caseData.clientName}</TableCell>
                  <TableCell sx={{ padding: '12px 16px' }}>
                    <Chip
                      label={caseData.status}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(caseData.status)}20`,
                        color: getStatusColor(caseData.status),
                        fontWeight: 500,
                        borderRadius: '6px',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: '12px 16px', color: caseData.sla === 'breach' ? '#D32F2F' : caseData.sla === 'warning' ? '#F57C00' : '#4CAF50', fontWeight: 600 }}>
                    {formatSLATimer(caseData.slaMinutesLeft)}
                  </TableCell>
                  <TableCell sx={{ padding: '12px 16px', color: '#666' }}>{caseData.priority}</TableCell>
                </>
              )}
            />
          </Grid>

          {/* Right Column - Context Cards */}
          <Grid item xs={12} lg={3}>
            {/* Escalations */}
            <Card sx={{ mb: 3, backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #EFEFEF' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#212121' }}>
                  Escalations
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {allCases.filter((c) => c.escalated).slice(0, 5).map((caseData: CaseData, idx: number) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      backgroundColor: '#FFF3E0',
                      borderRadius: '6px',
                      borderLeft: '3px solid #F57C00',
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#E65100' }}>
                      {caseData.applicationId}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {caseData.clientName}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Recent Updates */}
            <Card sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #EFEFEF' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#212121' }}>
                  Recent Updates
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {allCases.slice(0, 5).map((caseData: CaseData, idx: number) => (
                  <Box key={idx} sx={{ p: 1.5, mb: 1, borderBottom: '1px solid #EFEFEF' }}>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 500, color: '#212121' }}>
                      {caseData.applicationId}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                      {caseData.owner ? `Assigned to ${caseData.owner}` : 'Unassigned'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Metrics */}
        <Card sx={{ mt: 3, backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121', mb: 2 }}>
              Personal Performance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#4CAF50', mb: 1 }}>
                    92%
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    SLA Compliance
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976D2', mb: 1 }}>
                    2h 15m
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Avg Response Time
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#F57C00', mb: 1 }}>
                    12
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Completed Today
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#2E7D32', mb: 1 }}>
                    47
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Completed This Week
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default OnboardingOfficersDashboard;
