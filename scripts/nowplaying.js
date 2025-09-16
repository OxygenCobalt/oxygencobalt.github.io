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
    const defaultArtwork = '/res/album.svg';
    
    // Variable to store the previous listen data for comparison
    let previousListenData = null;
    
    // Set default artwork initially
    artwork.src = defaultArtwork;
    artwork.alt = 'Default album artwork';
    // Apply icon class immediately to ensure it's visible in light mode
    artwork.classList.add('icon');
    
    // Add error handling for the artwork image
    artwork.addEventListener('error', function() {
        // If the image fails to load, use default artwork
        this.src = defaultArtwork;
        this.alt = 'Default album artwork';
        // Ensure icon class is applied for the default SVG
        this.classList.add('icon');
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
    
    // Function to compare two listen objects to check if they're the same
    function isListenEqual(listen1, listen2) {
        if (!listen1 || !listen2) return false;
        
        const track1 = listen1.track_metadata;
        const track2 = listen2.track_metadata;
        
        return track1.track_name === track2.track_name &&
               track1.artist_name === track2.artist_name &&
               track1.release_name === track2.release_name;
    }
    
    // Function to fetch now playing data from ListenBrainz
    async function fetchNowPlaying() {
        try {
            // Get the playing-now information
            const response = await fetch(`https://api.listenbrainz.org/1/user/${username}/playing-now`);
            const data = await response.json();
            
            // Update connection status to "connected" (dim green)
            playingStatus.classList.remove('no-connection');
            playingStatus.classList.add('connected');
            
            // Check if we have actual track metadata
            if (data.payload.count > 0 && data.payload.listens && data.payload.listens.length > 0) {
                const currentListen = data.payload.listens[0];
                
                // Check if the current listen data is the same as the previous one
                if (isListenEqual(currentListen, previousListenData)) {
                    // Maintain active state but return early
                    playingStatus.classList.add('active');
                    return; // Skip updating if data hasn't changed
                }
                
                // Save the current listen as previous for next comparison
                previousListenData = currentListen;
                
                const track = currentListen.track_metadata;
                
                // Keep existing elements hidden until we're ready to update
                let artworkUrl = defaultArtwork;
                let artworkAlt = 'Default album artwork';
                let shouldUseIcon = true;
                
                // Get album art if we have artist and album information
                if (track.artist_name && track.release_name) {
                    // Fetch album art from Cover Art Archive
                    const fetchedArtworkUrl = await fetchAlbumArt(track.artist_name, track.release_name);
                    
                    if (fetchedArtworkUrl) {
                        // Test if the image can be loaded
                        try {
                            await new Promise((resolve, reject) => {
                                const tempImage = new Image();
                                tempImage.onload = resolve;
                                tempImage.onerror = reject;
                                tempImage.src = fetchedArtworkUrl;
                            });
                            
                            // Image loaded successfully
                            artworkUrl = fetchedArtworkUrl;
                            artworkAlt = `${track.release_name} by ${track.artist_name}`;
                            shouldUseIcon = false;
                        } catch (error) {
                            // Image failed to load, keep defaults
                            console.error('Failed to load artwork:', error);
                        }
                    }
                }
                
                // Now update all UI elements at once
                header.textContent = "Listening to...";
                title.textContent = track.track_name || 'Unknown Track';
                artist.textContent = track.artist_name || 'Unknown Artist';
                
                // Update artwork
                artwork.style.display = 'block';
                artwork.src = artworkUrl;
                artwork.alt = artworkAlt;
                
                if (shouldUseIcon) {
                    artwork.classList.add('icon');
                } else {
                    artwork.classList.remove('icon');
                }
                
                // Show all elements when playing
                container.classList.add('active');
                playingStatus.classList.add('active'); // Show as active (bright green)
                document.querySelector('.now-playing-details').style.display = 'flex';
                container.setAttribute('href', `https://listenbrainz.org/user/${username}/`);
            } else {
                // If nothing is playing (empty listens array)
                // Only update if we were previously playing something
                if (previousListenData !== null) {
                    previousListenData = null;
                    header.textContent = "Not listening to anything!";
                    title.textContent = "";
                    artist.textContent = "";
                    artwork.style.display = 'none';
                    artwork.src = ""; // Clear the src to prevent phantom images
                    container.classList.remove('active');
                    // Connected but not playing - stays dim green
                    playingStatus.classList.remove('active');
                    document.querySelector('.now-playing-details').style.display = 'none';
                    container.setAttribute('href', `https://listenbrainz.org/user/${username}/`);
                }
            }
        } catch (error) {
            console.error('Error fetching ListenBrainz data:', error);
            // Set connection status to "no connection" (gray)
            playingStatus.classList.add('no-connection');
            playingStatus.classList.remove('connected');
            playingStatus.classList.remove('active');
            
            // Only update if we were previously playing something
            if (previousListenData !== null) {
                previousListenData = null;
                header.textContent = "Not listening to anything!";
                title.textContent = "";
                artist.textContent = "";
                artwork.style.display = 'none';
                artwork.src = ""; // Clear the src to prevent phantom images
                container.classList.remove('active');
                document.querySelector('.now-playing-details').style.display = 'none';
                container.setAttribute('href', `https://listenbrainz.org/user/${username}/`);
            }
        }
    }
    
    // Initial fetch
    fetchNowPlaying();
    
    // Refresh every 30 seconds
    setInterval(fetchNowPlaying, 30000);
}); 