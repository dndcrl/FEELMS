function changeContent() {
    const content = document.getElementById("content");
    const menu = document.getElementById("menu").value;

    const contentData = {
        about: "<h2>About MOODVIE</h2><p>MOODVIE is a website that recommends movies based on moods. Users can input their feelings or desired emotions, and the website suggests films that match their current state of mind. The goal is to provide a personalized and enjoyable movie-watching experience, helping users find the perfect film for any mood. The website features a clean and user-friendly interface, making it easy to navigate and discover new movies.</p>",
        request: "<h2>Request a Movie</h2><p>Submit a request for a movie to be added to our database.</p>",
        changelogs: "<h2>Changelogs</h2><p>View the latest updates and improvements to MOODVIE.</p>",
        acknowledgements: "<h2>Acknowledgements</h2><p>Thank you for visiting this website! I hope this website may help you to watch films. Long live Cinema. <br><br> Thank you for Pitchang for supporting me in anything. <3 <br><br> - Kai </p>"
    };

    content.innerHTML = contentData[menu];
}
