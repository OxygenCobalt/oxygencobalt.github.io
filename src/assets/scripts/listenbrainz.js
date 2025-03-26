// ListenBrainz integration to show currently playing music
document.addEventListener('DOMContentLoaded', function() {
    const username = 'oxycblt';
    const container = document.getElementById('now-playing-container');
    const header = document.getElementById('now-playing-header');
    const title = document.getElementById('now-playing-title');
    const artist = document.getElementById('now-playing-artist');
    const artwork = document.getElementById('now-playing-artwork');
    const playingStatus = document.getElementById('now-playing-status');
    
    // Function to fetch now playing data from ListenBrainz
    async function fetchNowPlaying() {
        try {
            // Get the playing-now information
            const response = await fetch(`https://api.listenbrainz.org/1/user/${username}/playing-now`);
            const data = await response.json();
            
            // Check if we have actual track metadata
            // Response examples:
            // Playing: {"payload":{"count":1,"listens":[{...track data...}],"playing_now":true,"user_id":"oxycblt"}}
            // Not playing: {"payload":{"count":0,"listens":[],"playing_now":true,"user_id":"oxycblt"}}
            if (data.payload.count > 0 && data.payload.listens && data.payload.listens.length > 0) {
                const listen = data.payload.listens[0];
                const track = listen.track_metadata;
                
                // Update track information
                header.textContent = "Listening to...";
                title.textContent = track.track_name || 'Unknown Track';
                artist.textContent = track.artist_name || 'Unknown Artist';
                
                // Update artwork if available
                if (track.additional_info && track.additional_info.media_url) {
                    artwork.src = track.additional_info.media_url;
                    artwork.style.display = 'block';
                } else {
                    artwork.style.display = 'none';
                }
                
                // Show the container
                container.classList.add('active');
                playingStatus.classList.add('active');
                container.setAttribute('href', `https://listenbrainz.org/user/${username}/`);
            } else {
                // If nothing is playing (empty listens array)
                header.textContent = "Not listening right now";
                title.textContent = "";
                artist.textContent = "";
                artwork.style.display = 'none';
                container.classList.remove('active');
                playingStatus.classList.remove('active');
                container.setAttribute('href', `https://listenbrainz.org/user/${username}/`);
            }
        } catch (error) {
            console.error('Error fetching ListenBrainz data:', error);
            header.textContent = "Not listening right now";
            title.textContent = "";
            artist.textContent = "";
            artwork.style.display = 'none';
            container.classList.remove('active');
            playingStatus.classList.remove('active');
            container.setAttribute('href', `https://listenbrainz.org/user/${username}/`);
        }
    }
    
    // Initial fetch
    fetchNowPlaying();
    
    // Refresh every 30 seconds
    setInterval(fetchNowPlaying, 30000);
}); 