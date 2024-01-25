const level = new Level(
[
   new Chicken(),
   new Chicken(),
   new Chicken(),
   new Chicken(),
   new Chicken(),
   new Chicken(),
   new Chicken(),
   new BigChick(),
],
[ 
    //heaven
    new Background('img/5_background/layers/air.png', -5, -40),
],
[  
    //movableClouds   
    new Cloud('img/5_background/layers/4_clouds/1.png', -720, -20, true),  
    new Cloud('img/5_background/layers/4_clouds/1.png', 0, -20, true),    
    new Cloud('img/5_background/layers/4_clouds/1.png', 720, -20, true),
],
[
    //backgroundObjects (unmovable)
    //imgPath and x, y in background.class
    new Cloud('img/5_background/layers/4_clouds/full.png', -5, -20, false),
    new Background('img/5_background/layers/3_third_layer/full.png', -5, -40, true),
    new Background('img/5_background/layers/2_second_layer/full.png', -6, -40),
    new Background('img/5_background/layers/1_first_layer/full.png', -7, -40)
]
);
