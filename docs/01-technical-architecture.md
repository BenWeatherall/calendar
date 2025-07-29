# Technical Architecture

## Technology Stack

- **Frontend**: Svelte 5 with SvelteKit
- **Backend**: Node.js with Express/Fastify
- **Database**: PostgreSQL (recommended for audit trails)
- **Authentication**: Google IAP Proxy
- **Cloud Services**: Google Cloud APIs
- **Testing**: Vitest (frontend), Jest (backend)
- **Build Tools**: Vite, TypeScript
- **Deployment**: Docker containers

## Architecture Principles

- **Separation of Concerns**: Clear frontend/backend boundaries
- **API-First Design**: RESTful API with proper versioning
- **Security by Design**: IAP integration, input validation, SQL injection prevention
- **Audit Trail**: Complete change tracking with timestamps and user attribution
- **Scalability**: Modular components, efficient data fetching
- **Maintainability**: TypeScript, comprehensive testing, documentation

## Database Schema Design

### Core Tables

```sql
-- Users table (synced from IAP)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table with audit fields
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    location VARCHAR(500),
    priority VARCHAR(20) DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(50) DEFAULT 'event' CHECK (category IN ('meeting', 'task', 'event', 'reminder', 'appointment')),
    tags TEXT[], -- PostgreSQL array for tags
    attendees TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Event history table for audit trail
CREATE TABLE event_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id),
    action VARCHAR(20) NOT NULL CHECK (action IN ('created', 'updated', 'deleted')),
    changed_fields JSONB,
    previous_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT NOW()
);
```

## Backend API Design

### API Endpoints

```
Authentication Middleware:
- Extract user email from IAP headers
- Validate user session
- Attach user context to requests

Events API:
GET    /api/v1/events                    # List events with filtering
GET    /api/v1/events/:id                # Get single event
POST   /api/v1/events                    # Create event
PUT    /api/v1/events/:id                # Update event
DELETE /api/v1/events/:id                # Soft delete event
GET    /api/v1/events/:id/history        # Get event history

Users API:
GET    /api/v1/users/profile             # Get current user profile
PUT    /api/v1/users/profile             # Update user profile

Health & System:
GET    /api/health                       # Health check
GET    /api/v1/system/info              # System information
```

### Backend Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── events.controller.ts
│   │   ├── users.controller.ts
│   │   └── health.controller.ts
│   ├── services/
│   │   ├── events.service.ts
│   │   ├── users.service.ts
│   │   ├── googleCloud.service.ts
│   │   └── audit.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/
│   │   ├── event.model.ts
│   │   ├── user.model.ts
│   │   └── history.model.ts
│   ├── routes/
│   │   ├── events.routes.ts
│   │   ├── users.routes.ts
│   │   └── index.ts
│   ├── database/
│   │   ├── connection.ts
│   │   ├── migrations/
│   │   └── seeds/
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   └── app.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docker/
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Frontend Architecture

### Svelte 5 Project Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Calendar/
│   │   │   │   ├── CalendarContainer.svelte
│   │   │   │   ├── CalendarToolbar.svelte
│   │   │   │   ├── EventRenderer.svelte
│   │   │   │   └── ViewControls.svelte
│   │   │   ├── Sidebar/
│   │   │   │   ├── EventsSidebar.svelte
│   │   │   │   ├── EventsAccordion.svelte
│   │   │   │   ├── EventItem.svelte
│   │   │   │   └── TagGroup.svelte
│   │   │   ├── EventForm/
│   │   │   │   ├── EventForm.svelte
│   │   │   │   ├── EventFormFields.svelte
│   │   │   │   └── EventValidation.ts
│   │   │   ├── UI/
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Input.svelte
│   │   │   │   ├── Select.svelte
│   │   │   │   ├── Modal.svelte
│   │   │   │   └── Accordion.svelte
│   │   │   └── Common/
│   │   │       ├── LoadingSpinner.svelte
│   │   │       ├── ErrorMessage.svelte
│   │   │       └── Header.svelte
│   │   ├── stores/
│   │   │   ├── events.store.ts
│   │   │   ├── user.store.ts
│   │   │   ├── calendar.store.ts
│   │   │   └── ui.store.ts
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── events.service.ts
│   │   │   ├── calendar.service.ts
│   │   │   └── validation.service.ts
│   │   ├── utils/
│   │   │   ├── dateUtils.ts
│   │   │   ├── formatters.ts
│   │   │   ├── constants.ts
│   │   │   └── types.ts
│   │   └── styles/
│   │       ├── global.css
│   │       ├── calendar.css
│   │       ├── sidebar.css
│   │       └── components.css
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +layout.ts
│   │   ├── +page.svelte
│   │   └── +page.ts
│   ├── app.html
│   └── app.css
├── static/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── svelte.config.js
├── vite.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

### State Management (Svelte 5 Runes)

```typescript
// stores/events.store.ts
import { writable } from 'svelte/store';

export const events = writable<Event[]>([]);
export const selectedEvent = writable<Event | null>(null);
export const filteredEvents = writable<Event[]>([]);
export const eventsByTags = writable<Record<string, Event[]>>({});

// stores/calendar.store.ts
export const currentView = writable<'day' | 'week' | 'month' | 'year'>('month');
export const currentDate = writable<Date>(new Date());
export const viewPeriod = writable<string>('');

// stores/user.store.ts
export const user = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);
```

## Calendar Library Integration

### dhtmlxScheduler Wrapper Component

```svelte
<!-- CalendarContainer.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { events, currentView, currentDate } from '$lib/stores';
    
    let calendarContainer: HTMLElement;
    let scheduler: any;
    
    onMount(async () => {
        // Dynamic import of dhtmlxScheduler
        const { default: dhx } = await import('dhtmlx-scheduler');
        scheduler = dhx;
        
        // Initialize scheduler with current configuration
        initializeScheduler();
        loadEvents();
    });
    
    function initializeScheduler() {
        // Port existing scheduler configuration
        // Maintain all current styling and behavior
    }
    
    // Event handlers for Svelte reactivity
    $: if (scheduler && $events) {
        updateSchedulerEvents($events);
    }
</script>

<div bind:this={calendarContainer} class="calendar-container">
    <div id="scheduler_here" class="dhx_cal_container">
        <!-- Scheduler markup -->
    </div>
</div>
```

## Testing Strategy

### Backend Testing
- **Unit Tests**: Service layer, utility functions, validators
- **Integration Tests**: API endpoints, database operations
- **Load Tests**: Performance under concurrent users
- **Security Tests**: Input validation, authentication flows

### Frontend Testing
- **Unit Tests**: Individual components, stores, utilities
- **Integration Tests**: Component interactions, API integration
- **End-to-End Tests**: Complete user workflows
- **Visual Regression Tests**: UI consistency across changes

### Test Coverage Goals
- Backend: 90%+ code coverage
- Frontend: 85%+ code coverage
- Critical paths: 100% coverage

## Security Considerations

### Authentication & Authorization
- IAP proxy integration for user identification
- JWT token management for API communication
- Role-based access control for future expansion

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection with Content Security Policy
- HTTPS enforcement

### API Security
- Rate limiting
- CORS configuration
- Request size limits
- API versioning for backward compatibility

## Performance Considerations

### Frontend Optimization
- Component lazy loading
- Virtual scrolling for large event lists
- Efficient state updates with Svelte reactivity
- Bundle splitting and code optimization

### Backend Optimization
- Database query optimization
- Caching strategies (Redis for session/frequently accessed data)
- Connection pooling
- Response compression

### Monitoring
- Application performance monitoring
- Error tracking and alerting
- User experience metrics
- Database performance monitoring

## Deployment Architecture

### Production Environment
```
Internet -> Google Load Balancer -> IAP Proxy -> Application Load Balancer
                                                       |
                                                   Kubernetes Cluster
                                                   ├── Frontend Pods (SvelteKit)
                                                   ├── Backend Pods (Node.js)
                                                   └── Database (Cloud SQL PostgreSQL)
```

### Development/Staging Pipeline
- Feature branches trigger preview deployments
- Staging environment mirrors production
- Automated testing before production deployment
- Blue-green deployment strategy for zero-downtime updates 