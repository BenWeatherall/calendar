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
}); 