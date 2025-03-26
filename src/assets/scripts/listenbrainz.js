// ListenBrainz integration to show currently playing music
document.addEventListener('DOMContentLoaded', function() {
    const username = 'oxycblt';
    const container = document.getElementById('now-playing-container');
    const header = document.getElementById('now-playing-header');
    const title = document.getElementById('now-playing-title');
    const artist = document.getElementById('now-playing-artist');
    const artwork = document.getElementById('now-playing-artwork');
    const playingStatus = document.getElementById('now-playing-status');
    
    // Add error handling for the artwork image
    artwork.addEventListener('error', function() {
        // If the image fails to load, try a fallback
        const artistName = artist.textContent || 'music';
        // Only add error class if we're on the fallback URL already
        if (this.src.includes('picsum.photos')) {
            this.classList.add('error');
            this.classList.add('load-failed');
        } else {
            // Try the picsum fallback
            this.src = `https://picsum.photos/seed/${encodeURIComponent(artistName)}/250`;
            this.alt = 'Album artwork unavailable';
        }
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
                // Use Cover Art Archive to get the cover art
                const artworkUrl = `https://coverartarchive.org/release/${mbid}/front-250`;
                
                // Verify the URL works before returning it
                const exists = await checkUrlExists(artworkUrl);
                if (exists) {
                    return artworkUrl;
                }
                
                // If not, try the full URL without size constraint
                const fullArtworkUrl = `https://coverartarchive.org/release/${mbid}/front`;
                const fullExists = await checkUrlExists(fullArtworkUrl);
                if (fullExists) {
                    return fullArtworkUrl;
                }
            }
            
            // If we don't have a valid Cover Art Archive URL, use a fallback
            return `https://picsum.photos/seed/${encodeURIComponent(artistName)}/250`;
        } catch (error) {
            console.error('Error fetching album art:', error);
            // Return a fallback generic image based on artist name
            return `https://picsum.photos/seed/${encodeURIComponent(artistName)}/250`;
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
                
                // Update track information
                header.textContent = "Listening to...";
                title.textContent = track.track_name || 'Unknown Track';
                artist.textContent = track.artist_name || 'Unknown Artist';
                
                // Reset any error classes
                artwork.classList.remove('error');
                artwork.classList.remove('load-failed');
                
                // Get album art if we have artist and album information
                if (track.artist_name && track.release_name) {
                    // Show loading state
                    artwork.style.display = 'block';
                    
                    // Fetch album art from Cover Art Archive
                    const artworkUrl = await fetchAlbumArt(track.artist_name, track.release_name);
                    artwork.src = artworkUrl;
                    artwork.alt = `${track.release_name} by ${track.artist_name}`;
                } else {
                    artwork.style.display = 'none';
                }
                
                // Show all elements when playing
                container.classList.add('active');
                playingStatus.classList.add('active');
                document.querySelector('.now-playing-details').style.display = 'flex';
                container.setAttribute('href', `https://listenbrainz.org/user/${username}/`);
            } else {
                // If nothing is playing (empty listens array)
                header.textContent = "Not listening right now";
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
            header.textContent = "Not listening right now";
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