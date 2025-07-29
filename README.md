# Node.js Calendar Application with dhtmlxScheduler

A modern calendar application built with Node.js, Express, MongoDB, and dhtmlxScheduler following the tutorial from [DHTMLX blog](https://dhtmlx.com/blog/using-dhtmlxscheduler-with-node-js/).

## 🌟 Features

- **Full Calendar Interface**: Month, week, day, and year views with intuitive navigation
- **Events Sidebar**: Organized event listing with tag-based accordion grouping
- **Enhanced Event Fields**: Location, priority, tags, attendees, and category support
- **Smart Filtering**: Events filtered by current view period (day/week/month/year)
- **CRUD Operations**: Create, read, update, and delete events
- **Modern Responsive UI**: Clean design that adapts to desktop and mobile
- **Real-time Updates**: Events are automatically saved to the backend
- **MongoDB Integration**: Persistent data storage with fallback to mock data
- **Comprehensive Testing**: Complete test suite with Jest
- **Drag & Drop**: Intuitive event modification through dragging
- **Double-click Creation**: Easy event creation by double-clicking
- **Priority & Category Styling**: Visual event differentiation based on priority and category

## 🚀 Quick Start

### Prerequisites

- Node.js (v12 or higher)
- MongoDB (optional - app works with mock data)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd calendar
   npm install
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

4. **Initialize test data (optional):**
   Visit `http://localhost:3000/init` to populate with sample events

## 📱 Usage

### Events Sidebar
- **Tag-based Organization**: Events are automatically grouped by their tags in an accordion interface
- **View Period Filtering**: Only events in the current view period (day/week/month/year) are shown
- **Quick Navigation**: Click any event in the sidebar to jump to its date on the calendar
- **Event Count Badges**: See how many events are in each tag group
- **Responsive Design**: Sidebar adapts to mobile devices (stacks below calendar on small screens)

### Creating Events
- **Double-click** on any date/time to create a new event
- Fill in the comprehensive event form with:
  - **Description**: Main event text
  - **Location**: Where the event takes place (displays with 📍 icon)
  - **Priority**: Low/Medium/High/Urgent (affects visual styling and displays with colored badges)
  - **Tags**: Comma-separated tags for organization (used in sidebar grouping)
  - **Attendees**: People attending the event
  - **Category**: Meeting/Task/Event/Reminder/Appointment (affects visual styling)
- Click "Save" to add the event

### Enhanced Event Display
- **Priority Indicators**: Events show priority badges (🔸 Medium, 🔶 High, 🔴 Urgent)
- **Location Display**: Events show location with 📍 icon
- **Tag Display**: Events show tags with 🏷️ icon
- **Color Coding**: Events are styled based on priority and category

### Modifying Events
- **Click** on an event to edit its details
- **Drag** events to move them to different dates/times
- **Resize** events by dragging their edges (in day/week view)

### Navigation
- Use **arrow buttons** to navigate between months/weeks/days
- Click **Today** to return to the current date
- Switch between **Month**, **Week**, **Day**, and **Year** views using the tabs
- **Year View**: Click calendar icon to quickly jump to any year

### Viewing Events
- **Month view**: Shows all events for the month
- **Week view**: Detailed week layout with time slots
- **Day view**: Hour-by-hour breakdown of a single day
- **Year view**: Annual overview for long-term planning

## 🛠 Development

### Project Structure

```
calendar/
├── app.js              # Express server with MongoDB integration
├── package.json        # Dependencies and scripts
├── public/
│   └── index.html     # Frontend calendar interface
├── tests/
│   ├── app.test.js    # Backend API tests
│   └── frontend.test.js # Frontend HTML/JS tests
└── README.md          # This file
```

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serve the main calendar interface |
| GET | `/data` | Fetch all calendar events |
| POST | `/data` | Create, update, or delete events |
| GET | `/init` | Initialize database with test data |

### Testing

The application includes comprehensive test coverage:

**Backend Tests (15 tests):**
- API endpoint functionality
- CRUD operations with enhanced event fields
- Error handling
- Static file serving

**Frontend Tests (49 tests):**
- HTML structure validation
- Events sidebar and accordion functionality  
- JavaScript configuration for enhanced fields
- CSS styling verification including responsive design
- User experience features
- Tag-based organization and filtering
- Priority and category styling
- Mobile layout adaptation

**Total: 64 tests**

Run tests with:
```bash
npm test
```

## 📊 Technical Details

### Backend Technologies
- **Express.js**: Web framework for Node.js
- **MongoDB**: Document database for event storage
- **Body-parser**: Middleware for parsing request bodies

### Frontend Technologies
- **dhtmlxScheduler**: Professional JavaScript calendar component with year view
- **Event Sidebar**: Custom accordion-based event organization by tags
- **Responsive Design**: Mobile-first CSS with flexbox layout
- **Enhanced UI**: Priority and category-based visual styling

### Data Flow

1. **Frontend** loads calendar interface from `/public/index.html`
2. **JavaScript** initializes dhtmlxScheduler and loads events from `/data`
3. **User interactions** trigger CRUD operations via dataProcessor
4. **Backend** processes requests and updates MongoDB
5. **Real-time updates** keep the calendar synchronized

## 🗄 Database Schema

Events are stored with the following structure:

```javascript
{
  _id: ObjectId,           // MongoDB unique identifier
  id: String,              // Frontend-friendly ID
  text: String,            // Event title/description
  start_date: Date,        // Event start time
  end_date: Date,          // Event end time
  location: String,        // Event location (optional)
  priority: String,        // Priority level: "low", "medium", "high", "urgent" (optional)
  tags: String,            // Comma-separated tags for organization (optional)
  attendees: String,       // Event attendees (optional)
  category: String,        // Category: "meeting", "task", "event", "reminder", "appointment" (optional)
  color: String            // Event color (hex code, optional)
}
```

### Enhanced Field Details

- **location**: Displayed with 📍 icon in event view
- **priority**: Affects visual styling and sidebar badges
  - `low`: Default styling
  - `medium`: Yellow badge (🔸)
  - `high`: Orange badge (🔶) 
  - `urgent`: Red badge (🔴) with bold styling
- **tags**: Used for sidebar organization and grouping
- **category**: Affects event color coding
  - `meeting`: Blue styling
  - `task`: Green styling  
  - `reminder`: Yellow styling
  - `appointment`: Purple styling
  - `event`: Default styling

## 🔧 Configuration

### MongoDB Connection

The app connects to MongoDB at `mongodb://localhost:27017/testdb`. If MongoDB is not available, the application gracefully falls back to mock data, allowing development without a database setup.

To use MongoDB:
1. Install and start MongoDB
2. The database and collection are created automatically
3. Visit `/init` to populate with sample data

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| MONGO_URL | mongodb://localhost:27017 | MongoDB connection string |

## 🐛 Troubleshooting

### Common Issues

**"dataProcessor is not defined" error:**
- Fixed in current version by using modern `scheduler.createDataProcessor()` API
- Fallback to legacy `dataProcessor` for older versions

**Port already in use:**
- Stop any running instances: `pkill -f "node app.js"`
- Or use a different port: `PORT=3001 npm start`

**MongoDB connection issues:**
- App works without MongoDB using mock data
- Check MongoDB is running: `mongod --version`

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📚 References

- [Original DHTMLX Tutorial](https://dhtmlx.com/blog/using-dhtmlxscheduler-with-node-js/)
- [dhtmlxScheduler Documentation](https://docs.dhtmlx.com/scheduler/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/) 