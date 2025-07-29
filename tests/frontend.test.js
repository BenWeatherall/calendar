const fs = require('fs');
const path = require('path');

describe('Frontend Calendar Tests', () => {
    let indexHtmlContent;

    beforeAll(() => {
        const indexPath = path.join(__dirname, '../public/index.html');
        indexHtmlContent = fs.readFileSync(indexPath, 'utf8');
    });

    describe('HTML Structure', () => {
        it('should contain dhtmlxScheduler CDN links', () => {
            expect(indexHtmlContent).toContain('dhtmlxscheduler.js');
            expect(indexHtmlContent).toContain('dhtmlxscheduler.css');
        });

        it('should have proper calendar container structure', () => {
            expect(indexHtmlContent).toContain('id="scheduler_here"');
            expect(indexHtmlContent).toContain('class="dhx_cal_container"');
            expect(indexHtmlContent).toContain('dhx_cal_navline');
            expect(indexHtmlContent).toContain('dhx_cal_header');
            expect(indexHtmlContent).toContain('dhx_cal_data');
        });

        it('should have navigation buttons', () => {
            expect(indexHtmlContent).toContain('dhx_cal_prev_button');
            expect(indexHtmlContent).toContain('dhx_cal_next_button');
            expect(indexHtmlContent).toContain('dhx_cal_today_button');
        });

        it('should have view tabs', () => {
            expect(indexHtmlContent).toContain('name="day_tab"');
            expect(indexHtmlContent).toContain('name="week_tab"');
            expect(indexHtmlContent).toContain('name="month_tab"');
        });
    });

    describe('JavaScript Configuration', () => {
        it('should contain init function', () => {
            expect(indexHtmlContent).toContain('function init()');
            expect(indexHtmlContent).toContain('scheduler.init');
        });

        it('should configure data loading', () => {
            expect(indexHtmlContent).toContain('scheduler.load("/data", "json")');
        });

        it('should configure data processing', () => {
            expect(indexHtmlContent).toContain('scheduler.createDataProcessor');
            expect(indexHtmlContent).toContain('url: "/data"');
        });

        it('should have proper date configuration', () => {
            expect(indexHtmlContent).toContain('scheduler.templates.xml_date');
            expect(indexHtmlContent).toContain('scheduler.config.xml_date');
        });

        it('should enable event creation', () => {
            expect(indexHtmlContent).toContain('details_on_create');
            expect(indexHtmlContent).toContain('details_on_dblclick');
        });
    });

    describe('Styling', () => {
        it('should have responsive layout', () => {
            expect(indexHtmlContent).toContain('width:100%; height:100%');
            expect(indexHtmlContent).toContain('calc(100vh - 40px)');
        });

        it('should have custom styling', () => {
            expect(indexHtmlContent).toContain('.dhx_cal_container');
            expect(indexHtmlContent).toContain('.header-info');
            expect(indexHtmlContent).toContain('font-family: Arial');
        });

        it('should have proper container structure', () => {
            expect(indexHtmlContent).toContain('calendar-container');
            expect(indexHtmlContent).toContain('header-info');
        });
    });

    describe('User Experience Features', () => {
        it('should have informative header', () => {
            expect(indexHtmlContent).toContain('Click to add events');
            expect(indexHtmlContent).toContain('drag to modify');
        });

        it('should have proper page title', () => {
            expect(indexHtmlContent).toContain('<title>Node.js Calendar with dhtmlxScheduler</title>');
        });

        it('should initialize on page load', () => {
            expect(indexHtmlContent).toContain('onload="init();"');
        });
    });

    describe('Custom Fields Configuration', () => {
        it('should configure lightbox sections for custom fields', () => {
            expect(indexHtmlContent).toContain('scheduler.config.lightbox.sections');
            expect(indexHtmlContent).toContain('map_to: "location"');
            expect(indexHtmlContent).toContain('map_to: "priority"');
            expect(indexHtmlContent).toContain('map_to: "tags"');
            expect(indexHtmlContent).toContain('map_to: "attendees"');
            expect(indexHtmlContent).toContain('map_to: "category"');
        });

        it('should have priority options', () => {
            expect(indexHtmlContent).toContain('key: "low"');
            expect(indexHtmlContent).toContain('key: "medium"');
            expect(indexHtmlContent).toContain('key: "high"');
            expect(indexHtmlContent).toContain('key: "urgent"');
        });

        it('should have category options', () => {
            expect(indexHtmlContent).toContain('key: "meeting"');
            expect(indexHtmlContent).toContain('key: "task"');
            expect(indexHtmlContent).toContain('key: "event"');
            expect(indexHtmlContent).toContain('key: "reminder"');
            expect(indexHtmlContent).toContain('key: "appointment"');
        });

        it('should configure custom labels', () => {
            expect(indexHtmlContent).toContain('section_description = "Description"');
            expect(indexHtmlContent).toContain('section_location = "Location"');
            expect(indexHtmlContent).toContain('section_priority = "Priority"');
            expect(indexHtmlContent).toContain('section_tags = "Tags (comma-separated)"');
            expect(indexHtmlContent).toContain('section_attendees = "Attendees"');
            expect(indexHtmlContent).toContain('section_category = "Category"');
        });

        it('should have custom event rendering', () => {
            expect(indexHtmlContent).toContain('scheduler.templates.event_text');
            expect(indexHtmlContent).toContain('event.location');
            expect(indexHtmlContent).toContain('event.priority');
            expect(indexHtmlContent).toContain('event.tags');
        });

        it('should have event class styling', () => {
            expect(indexHtmlContent).toContain('scheduler.templates.event_class');
            expect(indexHtmlContent).toContain('priority_');
            expect(indexHtmlContent).toContain('category_');
        });
    });

    describe('Enhanced Styling', () => {
        it('should have priority-based styling', () => {
            expect(indexHtmlContent).toContain('.priority_high');
            expect(indexHtmlContent).toContain('.priority_urgent');
            expect(indexHtmlContent).toContain('.priority_medium');
        });

        it('should have category-based styling', () => {
            expect(indexHtmlContent).toContain('.category_meeting');
            expect(indexHtmlContent).toContain('.category_task');
            expect(indexHtmlContent).toContain('.category_reminder');
            expect(indexHtmlContent).toContain('.category_appointment');
        });
    });

    describe('Events Sidebar', () => {
        it('should have main container with flex layout', () => {
            expect(indexHtmlContent).toContain('class="main-container"');
            expect(indexHtmlContent).toContain('display: flex');
            expect(indexHtmlContent).toContain('height: 100vh');
        });

        it('should have events sidebar structure', () => {
            expect(indexHtmlContent).toContain('class="events-sidebar"');
            expect(indexHtmlContent).toContain('width: 300px');
            expect(indexHtmlContent).toContain('overflow-y: auto');
        });

        it('should have sidebar header', () => {
            expect(indexHtmlContent).toContain('class="sidebar-header"');
            expect(indexHtmlContent).toContain('📅 Events by Tags');
        });

        it('should have view period info section', () => {
            expect(indexHtmlContent).toContain('class="view-period-info"');
            expect(indexHtmlContent).toContain('id="viewPeriodInfo"');
            expect(indexHtmlContent).toContain('Current View: Month');
        });

        it('should have events accordion container', () => {
            expect(indexHtmlContent).toContain('id="eventsAccordion"');
            expect(indexHtmlContent).toContain('Accordion content will be populated by JavaScript');
        });

        it('should have calendar section structure', () => {
            expect(indexHtmlContent).toContain('class="calendar-section"');
            expect(indexHtmlContent).toContain('flex: 1');
            expect(indexHtmlContent).toContain('flex-direction: column');
        });
    });

    describe('Accordion Functionality', () => {
        it('should have accordion styling classes', () => {
            expect(indexHtmlContent).toContain('.accordion-item');
            expect(indexHtmlContent).toContain('.accordion-header');
            expect(indexHtmlContent).toContain('.accordion-content');
            expect(indexHtmlContent).toContain('.accordion-arrow');
        });

        it('should have accordion JavaScript functions', () => {
            expect(indexHtmlContent).toContain('function toggleAccordion');
            expect(indexHtmlContent).toContain('function updateEventsSidebar');
            expect(indexHtmlContent).toContain('function groupEventsByTags');
        });

        it('should have event filtering by view period', () => {
            expect(indexHtmlContent).toContain('function getFilteredEvents');
            expect(indexHtmlContent).toContain('currentView');
            expect(indexHtmlContent).toContain('currentDate');
        });

        it('should have tag count badges styling', () => {
            expect(indexHtmlContent).toContain('.tag-count');
            expect(indexHtmlContent).toContain('border-radius: 12px');
            expect(indexHtmlContent).toContain('background: #6c757d');
        });
    });

    describe('Event Item Styling', () => {
        it('should have event item classes', () => {
            expect(indexHtmlContent).toContain('.event-item');
            expect(indexHtmlContent).toContain('.event-title');
            expect(indexHtmlContent).toContain('.event-time');
            expect(indexHtmlContent).toContain('.event-location');
            expect(indexHtmlContent).toContain('.event-priority');
        });

        it('should have priority badge styling', () => {
            expect(indexHtmlContent).toContain('.priority-urgent');
            expect(indexHtmlContent).toContain('.priority-high');
            expect(indexHtmlContent).toContain('.priority-medium');
            expect(indexHtmlContent).toContain('.priority-low');
        });

        it('should have hover effects for event items', () => {
            expect(indexHtmlContent).toContain('.event-item:hover');
            expect(indexHtmlContent).toContain('background: #f8f9fa');
        });
    });

    describe('Responsive Design', () => {
        it('should have tablet responsive design', () => {
            expect(indexHtmlContent).toContain('@media (max-width: 768px)');
            expect(indexHtmlContent).toContain('width: 250px');
        });

        it('should have mobile responsive design', () => {
            expect(indexHtmlContent).toContain('@media (max-width: 576px)');
            expect(indexHtmlContent).toContain('flex-direction: column');
        });

        it('should stack sidebar below calendar on mobile', () => {
            expect(indexHtmlContent).toContain('order: 2');
            expect(indexHtmlContent).toContain('order: 1');
            expect(indexHtmlContent).toContain('height: 200px');
        });

        it('should adjust calendar height on mobile', () => {
            expect(indexHtmlContent).toContain('height: calc(100vh - 200px)');
        });
    });

    describe('Event Management Functions', () => {
        it('should have view period update function', () => {
            expect(indexHtmlContent).toContain('function updateViewPeriodInfo');
            expect(indexHtmlContent).toContain('viewInfo.textContent = periodText');
        });

        it('should have event time formatting function', () => {
            expect(indexHtmlContent).toContain('function formatEventTime');
            expect(indexHtmlContent).toContain('toLocaleTimeString');
            expect(indexHtmlContent).toContain('toLocaleDateString');
        });

        it('should have event selection function', () => {
            expect(indexHtmlContent).toContain('function selectEvent');
            expect(indexHtmlContent).toContain('scheduler.setCurrentView');
            expect(indexHtmlContent).toContain('scheduler.showEvent');
        });

        it('should have event listeners for view changes', () => {
            expect(indexHtmlContent).toContain('onViewChange');
            expect(indexHtmlContent).toContain('onAfterViewLoad');
            expect(indexHtmlContent).toContain('updateEventsSidebar()');
        });
    });

    describe('Enhanced Event Display', () => {
        it('should include year view in tabs', () => {
            expect(indexHtmlContent).toContain('name="year_tab"');
        });

        it('should enable year view plugin', () => {
            expect(indexHtmlContent).toContain('year_view: true');
        });

        it('should handle different view modes in filtering', () => {
            expect(indexHtmlContent).toContain('case \'day\'');
            expect(indexHtmlContent).toContain('case \'week\'');
            expect(indexHtmlContent).toContain('case \'month\'');
            expect(indexHtmlContent).toContain('case \'year\'');
        });

        it('should display priority emojis correctly', () => {
            expect(indexHtmlContent).toContain('priorityEmoji');
            expect(indexHtmlContent).toContain('🔸');
            expect(indexHtmlContent).toContain('🔶');
            expect(indexHtmlContent).toContain('🔴');
        });

        it('should display location and tags with icons', () => {
            expect(indexHtmlContent).toContain('📍');
            expect(indexHtmlContent).toContain('🏷️');
        });
    });
}); 