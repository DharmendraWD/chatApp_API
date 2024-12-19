
    // Helper function to calculate time ago

    console.log("sdlk")
    function timeAgo(timestamp) {
        const now = new Date();
        const seconds = Math.floor((now - timestamp) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (seconds < 60) {
            return `${seconds}s`;
        } else if (minutes < 60) {
            return `${minutes}m`;
        } else if (hours < 24) {
            return `${hours}h`;
        } else if (days < 30) {
            return `${days}d`;
        } else if (months < 12) {
            return `${months}m`;
        } else {
            return `${years}y`;
        }
    }

    // Function to update all timestamps in the chat
    function updateTimeAgo() {
        document.querySelectorAll('.timestamp').forEach(function (element) {
            const timestamp = new Date(element.getAttribute('data-timestamp'));
            element.textContent = timeAgo(timestamp);
        });
    }

    // Update time ago every minute
    setInterval(updateTimeAgo, 1000); // Every 60 seconds

    // Initial update when the page loads
    updateTimeAgo();
