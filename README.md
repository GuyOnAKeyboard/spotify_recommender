# 🎵 Spotify Recommender

A modern, beautiful web application that helps you discover and create personalized Spotify playlists based on genre, era, and language preferences.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Spotify API](https://img.shields.io/badge/Spotify-API-1DB954?style=flat-square&logo=spotify)

## ✨ Features

### 🎸 Smart Music Discovery
- **126+ Genres** - Dynamically fetched from Spotify's API
- **8 Era Filters** - From 1960s to 2020s
- **18 Languages** - Find music in your preferred language
- **Intelligent Search** - Smart handling of instrumental vs. vocal tracks

### 🎹 Instrumental Genre Intelligence
When you select instrumental genres (Lofi, Chill, Ambient, etc.), the app automatically shows you two options:
- **🎹 Search Instrumental Only** - Find pure instrumental tracks
- **🎤 Search with Language Filter** - Find vocal tracks in your selected language

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Beautiful frosted glass effects
- **Modal Results** - Immersive full-screen results view
- **Toast Notifications** - Real-time feedback for all actions
- **Responsive Layout** - Works on all screen sizes

### 💾 Playlist Management
- **Creative Titles** - Auto-generated playlist names (e.g., "2020s Pop Hits", "90s Rock Anthems")
- **Custom Descriptions** - Includes genre, era, and language info
- **Direct Spotify Integration** - Save directly to your Spotify account
- **Track Management** - Remove unwanted tracks before saving

### 🎵 Track Features
- **Play in Spotify** - Direct links to play full tracks
- **Album Artwork** - Beautiful cover images
- **Artist Information** - See all contributing artists
- **Regenerate** - Get fresh recommendations anytime

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A Spotify account
- Spotify Developer App credentials

### 1. Clone the Repository
```bash
git clone https://github.com/GuyOnAKeyboard/spotify_recommender.git
cd spotify_recomender
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Spotify API
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:3000/api/auth/callback/spotify` to Redirect URIs or use `http://127.0.0.1:3000/api/auth/callback/spotify`
4. Copy your Client ID and Client Secret

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000 or run http://127.0.0.1:3000 if you have used **http://127.0.0.1:3000** above in your app setup in spotify developer dashboard
NEXTAUTH_SECRET=your_nextauth_secret_here
```

To generate a NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. or 
Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser

## 📖 How to Use

1. **Login with Spotify** - Click the login button and authorize the app
2. **Select Filters** - Choose genre, era, and/or language
3. **Search** - Click "🔍 Search Tracks" to find recommendations
4. **Review Results** - Browse tracks in the modal view
5. **Customize** - Remove unwanted tracks or regenerate for new options
6. **Save Playlist** - Click "💾 Save Playlist" to add to your Spotify

### Special: Instrumental Genres
When selecting instrumental genres like Lofi or Chill, you'll see a modal with two options:
- Choose **Instrumental Only** for pure instrumental tracks
- Choose **With Language Filter** to find vocal tracks in that genre

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: NextAuth.js with Spotify OAuth
- **API**: Spotify Web API
- **Styling**: Custom CSS with Glassmorphism
- **State Management**: React Hooks

## 📁 Project Structure

```
spotify_recomender/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth configuration
│   │   │   ├── genres/         # Genre/era/language metadata
│   │   │   ├── playlist/       # Playlist creation
│   │   │   └── recommendations/ # Track search
│   │   ├── layout.js           # Root layout with metadata
│   │   └── page.js             # Home page
│   ├── components/
│   │   ├── Dashboard.js        # Main app interface
│   │   ├── SearchableSelect.js # Custom dropdown
│   │   ├── Toast.js            # Notification component
│   │   └── InstrumentalModal.js # Instrumental genre modal
│   ├── lib/
│   │   ├── authOptions.js      # NextAuth config
│   │   └── spotify.js          # Spotify API client
│   └── styles/
│       └── main.css            # Global styles
├── public/
│   └── favicon.png             # App icon
├── .env.local                  # Environment variables (not in repo)
├── .gitignore                  # Git ignore rules
└── package.json                # Dependencies
```

## 🎨 Customization

### Adding More Languages
Edit `src/app/api/genres/route.js`:
```javascript
const languages = [
    "English", "Spanish", "Korean", // ... add more
];
```

### Changing Playlist Title Format
Edit `src/components/Dashboard.js` in the `savePlaylist` function.

### Modifying UI Colors
Edit `src/styles/main.css` to change the color scheme.

## 🐛 Troubleshooting

### "No tracks found"
- Try different filter combinations
- For instrumental genres, use "Search Instrumental Only"
- Some genre/language combinations may have limited results

### Authentication Issues
- Verify Redirect URI in Spotify Dashboard matches exactly
- Check `.env.local` credentials are correct
- Clear browser cookies and try again

### API Errors
- Ensure your Spotify app has the correct scopes
- Check that your access token hasn't expired (refresh the page)

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Credits

**Built by GuyOnAKeyboard**

Uses the [Spotify Web API](https://developer.spotify.com/documentation/web-api)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📧 Support

For issues or questions, please open an issue on GitHub. or reach out to me on  
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/ganguly-aniruddha)

---

**Enjoy discovering new music! 🎵✨**
