// Countdown Timer Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set initial time (11 minutes and 59 seconds)
    let totalSeconds = 11 * 60 + 59;
    
    // Update both timers
    function updateTimers() {
        if (totalSeconds <= 0) {
            // Reset to 11:59 when it reaches zero
            totalSeconds = 11 * 60 + 59;
        }
        
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        // Format the time
        const minutesTens = Math.floor(minutes / 10);
        const minutesOnes = minutes % 10;
        const secondsTens = Math.floor(seconds / 10);
        const secondsOnes = seconds % 10;
        
        // Update first timer
        document.getElementById('minutes-tens').textContent = minutesTens;
        document.getElementById('minutes-ones').textContent = minutesOnes;
        document.getElementById('seconds-tens').textContent = secondsTens;
        document.getElementById('seconds-ones').textContent = secondsOnes;
        
        // Update second timer if it exists
        if (document.getElementById('minutes-tens-2')) {
            document.getElementById('minutes-tens-2').textContent = minutesTens;
            document.getElementById('minutes-ones-2').textContent = minutesOnes;
            document.getElementById('seconds-tens-2').textContent = secondsTens;
            document.getElementById('seconds-ones-2').textContent = secondsOnes;
        }
        
        // Decrement the timer
        totalSeconds--;
    }
    
    // Initial update
    updateTimers();
    
    // Update every second
    setInterval(updateTimers, 1000);
});
