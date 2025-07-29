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
            expect(indexHtmlContent).toContain('dhtmlxscheduler_material.css');
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
}); 