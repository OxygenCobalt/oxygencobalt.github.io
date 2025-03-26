// ListenBrainz integration to show currently playing music
document.addEventListener('DOMContentLoaded', function() {
    const username = 'oxycblt';
    const container = document.getElementById('now-playing-container');
    const header = document.getElementById('now-playing-header');
    const title = document.getElementById('now-playing-title');
    const artist = document.getElementById('now-playing-artist');
    const artwork = document.getElementById('now-playing-artwork');
    const playingStatus = document.getElementById('now-playing-status');
    
    // Default artwork path
    const defaultArtwork = '/assets/img/album.svg';
    
    // Set default artwork initially
    artwork.src = defaultArtwork;
    artwork.alt = 'Default album artwork';
    
    // Add error handling for the artwork image
    artwork.addEventListener('error', function() {
        // If the image fails to load, use default artwork
        this.src = defaultArtwork;
        this.alt = 'Default album artwork';
    });
    
    // Function to check if a URL exists/responds
    async function checkUrlExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    // Function to fetch album art using Cover Art Archive
    async function fetchAlbumArt(artistName, albumName) {
        try {
            // First, search for the release in MusicBrainz
            const searchUrl = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(`artist:"${artistName}" AND release:"${albumName}"`)}&fmt=json&limit=1`;
            const searchResponse = await fetch(searchUrl, {
                headers: {
                    'User-Agent': 'OxygenCobalt-Website/1.0 (alex@oxycblt.org)'
                }
            });
            
            const searchData = await searchResponse.json();
            
            if (searchData.releases && searchData.releases.length > 0) {
                const mbid = searchData.releases[0].id;
                // Use Cover Art Archive to get the front cover
                // The URL should directly point to "front" which will redirect to the actual image
                return `https://coverartarchive.org/release/${mbid}/front`;
            }
            
            // Return null if we couldn't find a valid image
            return null;
        } catch (error) {
            console.error('Error fetching album art:', error);
            return null;
        }
    }
    
    // Function to fetch now playing data from ListenBrainz
    async function fetchNowPlaying() {
        try {
            // Get the playing-now information
            const response = await fetch(`https://api.listenbrainz.org/1/user/${username}/playing-now`);
            const data = await response.json();
            
            // Check if we have actual track metadata
            if (data.payload.count > 0 && data.payload.listens && data.payload.listens.length > 0) {
                const listen = data.payload.listens[0];
                const track = listen.track_metadata;
                
                // Start with the artwork in loading state - show default while loading
                artwork.style.display = 'block';
                artwork.src = defaultArtwork;
                artwork.alt = 'Loading album artwork...';
                
                // Now update the UI with track information
                header.textContent = "I'm listening to...";
                title.textContent = track.track_name || 'Unknown Track';
                artist.textContent = track.artist_name || 'Unknown Artist';
                
                // Get album art if we have artist and album information
                if (track.artist_name && track.release_name) {
                    // Fetch album art from Cover Art Archive
                    const artworkUrl = await fetchAlbumArt(track.artist_name, track.release_name);
                    
                    // Update artwork if we have it
                    if (artworkUrl) {
                        artwork.src = artworkUrl;
                        artwork.alt = `${track.release_name} by ${track.artist_name}`;
                    } else {
                        // Keep default artwork if not found
                        artwork.src = defaultArtwork;
                        artwork.alt = 'Default album artwork';
                    }
                } else {
                    // Keep default artwork if we don't have enough info
                    artwork.src = defaultArtwork;
                    artwork.alt = 'Default album artwork';
                }
                
                // Show all elements when playing
                container.classList.add('active');
                playingStatus.classList.add('active');
                document.querySelector('.now-playing-details').style.display = 'flex';
                container.setAttribute('href', `https://listenbrainz.org/user/${username}/`);
            } else {
                // If nothing is playing (empty listens array)
                header.textContent = "I'm not listening to anything!";
                title.textContent = "";
                artist.textContent = "";
                artwork.style.display = 'none';
                artwork.src = ""; // Clear the src to prevent phantom images
                container.classList.remove('active');
                playingStatus.classList.remove('active');
                document.querySelector('.now-playing-details').style.display = 'none';
                container.setAttribute('href', `https://listenbrainz.org/user/${username}/`);
            }
        } catch (error) {
            console.error('Error fetching ListenBrainz data:', error);
            header.textContent = "I'm not listening to anything!";
            title.textContent = "";
            artist.textContent = "";
            artwork.style.display = 'none';
            artwork.src = ""; // Clear the src to prevent phantom images
            container.classList.remove('active');
            playingStatus.classList.remove('active');
            document.querySelector('.now-playing-details').style.display = 'none';
            container.setAttribute('href', `https://listenbrainz.org/user/${username}/`);
        }
    }
    
    // Initial fetch
    fetchNowPlaying();
    
    // Refresh every 30 seconds
    setInterval(fetchNowPlaying, 30000);
}); 