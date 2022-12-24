
<?php
   $user = $_REQUEST['user'];
   $score = $_REQUEST['score'];

   $host_name = 'localhost';
   $database = 'tristureDatabase';
   $user_name = 'root';
   $password = 'samerelapute69';

   $link = new mysqli($host_name, $user_name, $password, $database);

   if ($link->connect_error) {
    die('<p>La connexion au serveur MySQL a échoué: '. $link->connect_error .'</p>');
    
   } else {
     echo '<p>Connexion au serveur MySQL établie avec succès.</p>';
   }
   mysqli_select_db($link,'WarriorStrikerScore');
    $sql= "INSERT INTO `WarriorStrikerScore`(`name`, `score`) VALUES ('" .$user . "', ". $score .")";
    if (mysqli_query($link, $sql)) {
        echo " New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($link);
    }
    mysqli_close($link);
?> 
