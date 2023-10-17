const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);
const N = 500;
const cars=generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i !== 0){
            NeuralNetwork.mutate(cars[i].brain,0.05);
        }
    }
}
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-110,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-140,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-310,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-310,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-600,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-455,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-800,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-1500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-1510,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-2300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-2330,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-1970,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1900,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1910,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-950,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-2200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-1210,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-1630,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1790,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-1400,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-1450,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-2400,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-2800,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-2500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-2500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-1200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-3000,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-3000,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-3180,35,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-3300,35,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-3320,35,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-3400,35,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-3500,40,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-3600,40,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-3600,30,60,"DUMMY",2),
    new Car(road.getLaneCenter(0),-3620,30,60,"DUMMY",2),
    new Car(road.getLaneCenter(0),-3800,30,60,"DUMMY",2),
    new Car(road.getLaneCenter(2),-3800,30,60,"DUMMY",2),
    new Car(road.getLaneCenter(2),-3950,30,60,"DUMMY",2),
    new Car(road.getLaneCenter(1),-4000,30,60,"DUMMY",2),



];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function generateCars(N){
    const cars =[];
    for (let i = 0; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"))
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders,traffic);
    }

//     // Update the number of cars passed for each car
//     cars.forEach(car => {
//         car.carsPassed = car.carsPassed || 0;  // Initialize if not already set
//         traffic.forEach(dummyCar => {
//             if (car.y < dummyCar.y ) {
//                 car.carsPassed++;
//             }
//         });
//     });
//
// // Find the best car based on distance and number of cars passed
//     bestCar = cars.reduce((best, current) => {
//         if (current.y < best.y || (current.y === best.y && current.carsPassed > best.carsPassed)) {
//             return current;
//         }
//         return best;
//     }, cars[0]);



    // best function
     bestCar = cars.find(
        c=>c.y === Math.min(
            ...cars.map(c=>c.y)
        )
    );

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx,"blue",true);
    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}