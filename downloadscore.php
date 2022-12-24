<?php
    $ranking = 1;

   $host_name = 'localhost';
   $database = 'tristureDatabase';
   $user_name = 'root';
   $password = 'samerelapute69';



   $link = new mysqli($host_name, $user_name, $password, $database);

   if ($link->connect_error) {
    die('connection to server failed '. $link->connect_error );
    
   } else {
     //echo '<p>Connexion au serveur MySQL établie avec succès.</p>';
   }
   $sql = "SELECT name, score FROM WarriorStrikerScore ORDER BY score DESC";
   $result = $link->query($sql);
   if (mysqli_num_rows($result) > 0) {
    /*Affichage des données résultats de chaque ligne*/
      while($row = mysqli_fetch_assoc($result)) {
        if($ranking <= 100){
            echo  $ranking++ ."   " . $row["name"]. "   " . $row["score"]. "\n";
        }
      }
    } else {
      echo "0 results";
    }
    
    mysqli_close($link);
?> 
