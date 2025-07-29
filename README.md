# Node.js Calendar Application with dhtmlxScheduler

A modern calendar application built with Node.js, Express, MongoDB, and dhtmlxScheduler following the tutorial from [DHTMLX blog](https://dhtmlx.com/blog/using-dhtmlxscheduler-with-node-js/).

## 🌟 Features

- **Full Calendar Interface**: Month, week, and day views with intuitive navigation
- **CRUD Operations**: Create, read, update, and delete events
- **Modern UI**: Clean, responsive design with Material Design styling
- **Real-time Updates**: Events are automatically saved to the backend
- **MongoDB Integration**: Persistent data storage with fallback to mock data
- **Comprehensive Testing**: Complete test suite with Jest
- **Drag & Drop**: Intuitive event modification through dragging
- **Double-click Creation**: Easy event creation by double-clicking

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

### Creating Events
- **Double-click** on any date/time to create a new event
- Fill in the event details in the popup form
- Click "Save" to add the event

### Modifying Events
- **Click** on an event to edit its details
- **Drag** events to move them to different dates/times
- **Resize** events by dragging their edges (in day/week view)

### Navigation
- Use **arrow buttons** to navigate between months/weeks/days
- Click **Today** to return to the current date
- Switch between **Month**, **Week**, and **Day** views using the tabs

### Viewing Events
- **Month view**: Shows all events for the month
- **Week view**: Detailed week layout with time slots
- **Day view**: Hour-by-hour breakdown of a single day

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

**Backend Tests (13 tests):**
- API endpoint functionality
- CRUD operations
- Error handling
- Static file serving

**Frontend Tests (15 tests):**
- HTML structure validation
- JavaScript configuration
- CSS styling verification
- User experience features

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
- **dhtmlxScheduler**: Professional JavaScript calendar component
- **Material Design**: Modern, clean styling
- **Responsive CSS**: Mobile-friendly layout

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
  color: String (optional) // Event color (hex code)
}
```

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