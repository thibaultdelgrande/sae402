<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Tracker-code mini-game</title>
    <link rel="stylesheet" href="tracker-code.css">
</head>
<body>
<header>
    <div class="difficulty-group"><p>Difficulty : </p><img src="..\public\img\star_fill.svg"><img src="..\public\img\star_fill.svg"><img src="..\public\img\star.svg"></div><div class="name">Working-class city</div></header>
<main>
    <p class="instruction">One of my dear friend send me a letter where he give me a little gift with this instructions.
        To open my gift, you need to draw numbers with this following paths :<br>
        - Start at 43 rue de l’Arbre (red dot), go down, then right, down, left and then stop at the next crossroad.
        <br>
        - Start at 2 Passage de l’Orme (green dot), go down, then left, down, right and then stop at the next crossroad.
        <br>
        - Start at 10 Passage des Allouette (blue dot), go down, then left, down, right, up, left, up and then stop at the next crossroad.
        <br>
        Okay now, use this numbers in this order and use the code to unlock it. Good luck!</p>
    <div id="container" class="container">
        <canvas id="drawing-area" class="drawing-area" height="803" width="850"></canvas>
        <button id="clear-button" class="clear-button" type="button">Clear</button>
    </div>
    <form action="" method="post">
        <label for="numero">Submit the number</label>
        <input type="number" id="numero" name="numero" required>
        <button type="submit">Verify</button>
    </form>

    <?php
    if(isset($_POST['numero'])) {
        if($_POST['numero'] == 528) {
            echo "<p class='answer' style='color:green;'>Well done, you are right!</p>";
        } else {
            echo "<p class='answer' style='color:red;'>Sorry, try again!</p>";
        }
    }
    ?>
</main>
</body>
<script src="js/tracker.js"></script>
</html>