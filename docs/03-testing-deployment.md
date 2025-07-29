# Testing & Deployment Strategy

## Testing Strategy

### Backend Testing

#### Unit Tests
- **Services**: Business logic testing with mocked dependencies
- **Controllers**: Request/response handling with mocked services
- **Utilities**: Helper functions and validation logic
- **Models**: Data transformation and validation

```typescript
// Example: events.service.test.ts
describe('EventsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createEvent', () => {
    it('should create event with audit trail', async () => {
      const mockEvent = { title: 'Test Event', start_date: new Date() };
      const result = await eventsService.createEvent('user-id', mockEvent);
      
      expect(result).toHaveProperty('id');
      expect(auditService.recordChange).toHaveBeenCalledWith({
        action: 'created',
        eventId: result.id,
        userId: 'user-id'
      });
    });
  });
});
```

#### Integration Tests
- **API Endpoints**: Full request/response cycle testing
- **Database Operations**: Real database interactions with test data
- **Authentication Flow**: IAP middleware integration
- **Google Cloud Integration**: Service integration with mocked GCP services

```typescript
// Example: events.integration.test.ts
describe('Events API', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });
  
  afterAll(async () => {
    await cleanupTestDatabase();
  });
  
  describe('POST /api/v1/events', () => {
    it('should create event when authenticated', async () => {
      const response = await request(app)
        .post('/api/v1/events')
        .set('x-goog-authenticated-user-email', 'test@example.com')
        .send({
          title: 'Test Event',
          start_date: '2024-01-01T10:00:00Z',
          end_date: '2024-01-01T11:00:00Z'
        });
        
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });
});
```

#### Load Testing
- **Concurrent Users**: Test with 100-1000 concurrent users
- **Event Creation**: Burst testing for event creation/updates
- **Data Retrieval**: Large dataset filtering and pagination
- **Database Performance**: Query optimization under load

### Frontend Testing

#### Unit Tests (Vitest)
- **Components**: Individual component behavior and props
- **Stores**: State management logic
- **Services**: API service layer and data transformation
- **Utilities**: Date formatting, validation functions

```typescript
// Example: EventForm.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import EventForm from '$lib/components/EventForm/EventForm.svelte';

describe('EventForm', () => {
  it('should validate required fields', async () => {
    const { getByTestId, getByText } = render(EventForm);
    
    const submitButton = getByTestId('submit-button');
    await fireEvent.click(submitButton);
    
    expect(getByText('Title is required')).toBeInTheDocument();
  });
  
  it('should emit event on valid submission', async () => {
    const { getByTestId, component } = render(EventForm);
    
    let emittedData;
    component.$on('submit', (event) => {
      emittedData = event.detail;
    });
    
    // Fill form and submit
    await fireEvent.input(getByTestId('title-input'), { target: { value: 'Test Event' } });
    await fireEvent.click(getByTestId('submit-button'));
    
    expect(emittedData).toEqual({
      title: 'Test Event',
      // ... other fields
    });
  });
});
```

#### Integration Tests
- **Component Interactions**: Parent-child component communication
- **Store Integration**: Components with state management
- **API Integration**: Service layer with mocked API responses
- **Router Integration**: Page navigation and route handling

#### End-to-End Tests (Playwright)
- **User Workflows**: Complete user journeys
- **Cross-browser Testing**: Chrome, Firefox, Safari
- **Mobile Testing**: Responsive design validation
- **Accessibility Testing**: Keyboard navigation, screen readers

```typescript
// Example: calendar.e2e.test.ts
import { test, expect } from '@playwright/test';

test.describe('Calendar Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });
  
  test('should create new event', async ({ page }) => {
    // Click on calendar to create event
    await page.click('.dhx_cal_data');
    
    // Fill event form
    await page.fill('[data-testid="event-title"]', 'E2E Test Event');
    await page.selectOption('[data-testid="event-priority"]', 'high');
    await page.fill('[data-testid="event-tags"]', 'testing, e2e');
    
    // Submit form
    await page.click('[data-testid="save-event"]');
    
    // Verify event appears in calendar
    await expect(page.locator('.dhx_cal_event').filter({ hasText: 'E2E Test Event' })).toBeVisible();
    
    // Verify event appears in sidebar
    await expect(page.locator('.event-item').filter({ hasText: 'E2E Test Event' })).toBeVisible();
  });
  
  test('should filter events by view period', async ({ page }) => {
    // Switch to week view
    await page.click('[name="week_tab"]');
    
    // Verify sidebar updates
    await expect(page.locator('#viewPeriodInfo')).toContainText('Week:');
    
    // Verify events are filtered
    const eventItems = page.locator('.event-item');
    const count = await eventItems.count();
    expect(count).toBeGreaterThan(0);
  });
});
```

#### Visual Regression Testing
- **Component Screenshots**: Automated visual comparisons
- **Responsive Layout**: Different screen sizes
- **Theme Consistency**: Color schemes and styling
- **Calendar Views**: All view modes (day, week, month, year)

### Test Coverage Goals
- **Backend**: 90%+ line coverage, 100% for critical paths
- **Frontend**: 85%+ line coverage, 100% for user workflows
- **E2E**: 100% coverage of primary user journeys

### Testing Infrastructure

#### Test Data Management
```typescript
// tests/fixtures/events.fixture.ts
export const createTestEvent = (overrides = {}) => ({
  title: 'Test Event',
  description: 'Test Description',
  start_date: new Date('2024-01-01T10:00:00Z'),
  end_date: new Date('2024-01-01T11:00:00Z'),
  priority: 'medium',
  category: 'meeting',
  tags: ['test', 'fixture'],
  ...overrides
});

export const createTestUser = (overrides = {}) => ({
  email: 'test@example.com',
  name: 'Test User',
  ...overrides
});
```

#### Mock Services
```typescript
// tests/mocks/googleCloud.mock.ts
export const mockGoogleCloudService = {
  getEvents: jest.fn().mockResolvedValue([]),
  createEvent: jest.fn().mockResolvedValue({ id: 'test-id' }),
  updateEvent: jest.fn().mockResolvedValue({ id: 'test-id' }),
  deleteEvent: jest.fn().mockResolvedValue(true)
};
```

## Deployment Strategy

### Containerization

#### Backend Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY dist ./dist
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose (Development)
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - ./frontend:/app
      - /app/node_modules
  
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/calendar
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=calendar
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm test
      - name: Run integration tests
        run: cd backend && npm run test:integration
  
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run unit tests
        run: cd frontend && npm test
      - name: Run E2E tests
        run: cd frontend && npm run test:e2e
  
  build-and-deploy:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: |
          docker build -t calendar-frontend ./frontend
          docker build -t calendar-backend ./backend
      - name: Deploy to staging
        run: |
          # Deploy to staging environment
      - name: Run smoke tests
        run: |
          # Run basic smoke tests against staging
      - name: Deploy to production
        run: |
          # Blue-green deployment to production
```

### Environment Configuration

#### Development Environment
- Local Docker containers
- Hot reloading enabled
- Debug logging
- Mock external services
- Test database

#### Staging Environment
- Production-like configuration
- Real Google Cloud services (dev project)
- Full monitoring stack
- Automated testing pipeline
- Performance profiling

#### Production Environment
- High availability setup
- Load balancing
- Auto-scaling
- Production Google Cloud services
- Comprehensive monitoring
- Backup and disaster recovery

### Deployment Architecture

#### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: calendar-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: calendar-frontend
  template:
    metadata:
      labels:
        app: calendar-frontend
    spec:
      containers:
      - name: frontend
        image: calendar-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: calendar-frontend-service
spec:
  selector:
    app: calendar-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

### Monitoring and Observability

#### Application Monitoring
- **Metrics**: Response times, error rates, throughput
- **Logging**: Structured logging with correlation IDs
- **Tracing**: Distributed tracing for request flows
- **Alerting**: Automated alerts for critical issues

#### Infrastructure Monitoring
- **Resource Usage**: CPU, memory, storage
- **Network**: Latency, bandwidth, connectivity
- **Database**: Query performance, connection pools
- **Kubernetes**: Pod health, cluster metrics

#### Tools
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Jaeger or Google Cloud Trace
- **Alerting**: PagerDuty or Google Cloud Monitoring

### Security Considerations

#### Runtime Security
- **Container Scanning**: Automated vulnerability scanning
- **Secret Management**: Google Secret Manager
- **Network Policies**: Kubernetes network policies
- **Resource Limits**: CPU and memory constraints

#### Application Security
- **Input Validation**: Comprehensive input sanitization
- **HTTPS Enforcement**: TLS 1.3 minimum
- **CORS Configuration**: Restricted origins
- **Content Security Policy**: XSS protection

### Backup and Disaster Recovery

#### Data Backup
- **Database**: Automated daily backups with point-in-time recovery
- **Configuration**: Version-controlled infrastructure as code
- **Secrets**: Encrypted backup of secrets and certificates

#### Disaster Recovery
- **RTO**: 4 hours (Recovery Time Objective)
- **RPO**: 1 hour (Recovery Point Objective)
- **Multi-region**: Active-passive setup across regions
- **Failover**: Automated failover procedures

### Performance Optimization

#### Frontend Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Defer non-critical component loading
- **Asset Optimization**: Image compression, font subsetting
- **Caching**: Browser caching and CDN integration

#### Backend Optimization
- **Database Indexing**: Optimized queries and indexes
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis for session and frequently accessed data
- **Compression**: Response compression (gzip, brotli)

#### Monitoring Performance
- **Core Web Vitals**: Largest Contentful Paint, Cumulative Layout Shift
- **API Performance**: 95th percentile response times < 500ms
- **Database Performance**: Query execution times and slow query logs
- **Infrastructure**: Resource utilization and scaling metrics 