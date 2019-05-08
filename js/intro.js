// universal color definitions
let redColor = '#FF6B6B',
    blueColor = '#4ECDC4',
    darkBlueColor = '#1A535C',
    greenColor = '#C7F464',
    greyColor = '#696969',
    backgroundColor = '#F7FFF7',
    barColor = '#1A535C',
    yellowColor = '#FFE66D';

// module aliases
class myWorld{
    constructor(){
        this.Engine = Matter.Engine;
        this.Render = Matter.Render;
        this.World = Matter.World;
        this.Runner = Matter.Runner;
        this.Bodies = Matter.Bodies;
        this.Events = Matter.Events;
        this.Vector = Matter.Vector;

        // create an engine
        this.engine = this.Engine.create();
        this.world = this.engine.world;

        // set gravity to 0
        this.world.gravity.y = 0;

        // get element
        this.canvas = document.getElementById('sandbox');

        // create a renderer
        this.render = this.Render.create({
            canvas: this.canvas,
            engine: this.engine,
            options: {
                width: 800,
                height: 600,
                showVelocity: true,
                wireframes: false,
                background: backgroundColor 
            }
        });

    }

    setWorld(){
        // add all bodies
        this.World.add(this.world, [
            // walls
            this.Bodies.rectangle(400, 0, 800, 50, { isStatic: true, restitution: 1,
                render: {fillStyle: blueColor}}),
            this.Bodies.rectangle(400, 600, 800, 50, { isStatic: true, restitution: 1,
                render: {fillStyle: blueColor}}),
            this.Bodies.rectangle(800, 300, 50, 600, { isStatic: true, restitution: 1,
                render: {fillStyle: blueColor}}),
            this.Bodies.rectangle(0, 300, 50, 600, { isStatic: true, restitution: 1,
                render: {fillStyle: blueColor}})
        ]);
    }

    addBodies(){
        // create one particle
        this.circle = this.Bodies.circle(100, 100, 10,
            {restitution: 1, frictionAir: 0, friction: 0, slop: 0, frictionStatic: 0,
                render: { fillStyle: redColor}});
        Matter.Body.setVelocity(this.circle, Matter.Vector.create(Math.random(), Math.random()));

        // add all bodies
        this.World.add(this.world, [
            // flying body
            this.circle
        ]);

        // has to be run sequentially
        this.Mouse = Matter.Mouse,
        this.MouseConstraint = Matter.MouseConstraint;
        // add mouse control
        this.mouse = this.Mouse.create(this.render.canvas);
        this.mouseConstraint = this.MouseConstraint.create(this.engine, {
            mouse: this.mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        this.World.add(this.world, this.mouseConstraint);

        // keep the mouse in sync with rendering
        this.render.mouse = this.mouse;
    }

    resetWorld(){
        this.World.clear(this.world);
    }

    runWorld(){
        // run the engine
        this.Engine.run(this.engine);

        // run the renderer
        this.Render.run(this.render);
    }

    removeBodies(){
        this.World.remove(this.world, this.circle)
    }

    addMouse(){
        this.Mouse = Matter.Mouse,
        this.MouseConstraint = Matter.MouseConstraint;
        // add mouse control
        this.mouse = this.Mouse.create(this.render.canvas);
        this.mouseConstraint = this.MouseConstraint.create(this.engine, {
            mouse: this.mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        this.World.add(this.world, this.mouseConstraint);

        // keep the mouse in sync with rendering
        this.render.mouse = this.mouse;    
    }
}

class myGui{
    constructor(){
        // create a gui
        this.gui = new dat.GUI({ autoplace: false, width: 200 });
        // gui.domElement.id = 'gui';
        this.customContainer = $('.datgui').append($(this.gui.domElement));    
    }

    addItems(circle){
        this.gui.add(circle.velocity, 'x', 0, 10).name('x-velocity');
        this.gui.add(circle.velocity, 'y', 0, 10).name('y-velocity');
        // gui.add(circle.position, 'x', 0, 800).name('x-position');
        // gui.add(circle.position, 'y', 0, 600).name('y-position');
        this.gui.add(circle.force, 'x', -0.1, 0.1).name('x-force');
        this.gui.add(circle.force, 'y', -0.1, 0.1).name('y-force');
        this.gui.add(circle, 'mass', 0, 10).name('mass');
    }
}

sim = new myWorld();
gui = new myGui();
sim.setWorld();
sim.addBodies();
gui.addItems(sim.circle);
sim.runWorld();

// variables for plotting
let v,
    p,
    f,
    m,
    a;

// import d3 chart
// const d3Plots = require('./d3_test4');

// define chart here
let grChart = new d3Chart().create_chart('#d3');
x_line = grChart.add_line('steelblue');
y_line = grChart.add_line('red');
grChart.add_legend([{'name': 'x-velocity', 'color': 'steelblue'}, {'name': 'y-velocity', 'color': 'red'}]);

// define equation here
let eqChart = new add_equation();
eqChart.create_chart('#equation');
eqChart.add_text(redColor);
params = [{'cst': 'v^2', 'color': 'steelblue', 'value': 'sim.Vector.magnitude(v)'}, {'cst': '=', 'color': 'white', 'value': null},
    {'cst': 'v_x^2', 'color': 'red', 'value': 'v.x*v.x'}, {'cst': '+', 'color': 'white', 'value': null},
    {'cst': 'v_y^2', 'color': 'grey', 'value': 'v.y*v.y'}];
eqChart.change_equation(params);
// add bar
eqChart.add_bar('#equation', [{'value': 5, 'color': 'steelblue'}, {'value': 5, 'color': 'red'},
    {'value': 5, 'color': 'grey'}]);
// eqChart.text.text.onclick = changeParams();
// eqChart.svg.onclick = console.log('you clicked!');
// eqChart.button.on('click', console.log('you clicked!'));

// store variables
sim.Events.on(sim.render, 'afterRender', function get_vars() {
        v = sim.circle.velocity;
        p = sim.circle.position;
        f = sim.circle.force;
        m = sim.circle.mass;
        a = f/m;
        // console.log([v, p, f, m, a]);
        // console.log(f.y);

        let now = new Date(Date.now() - grChart.duration);
        grChart.shift_axis(now);
        grChart.plot_vs_t(v.x, x_line, now);
        grChart.plot_vs_t(v.y, y_line, now);

        // equation
        let paramsPlot = params.slice();
        for (i in paramsPlot){
            if (paramsPlot[i].value == null){
                paramsPlot.splice(i, 1);
            }
        }

        eqChart.update_bar(paramsPlot);
        
    }
);

// stop the world
function relaunch(sim){
    // Engine.clear(engine);
    // remove all bodies from world
    sim.resetWorld();

    // reset world
    sim.setWorld();
    sim.addBodies();
}

// Relaunch the world
document.getElementById('startButton').setAttribute('onclick', 'relaunch(sim)');
document.getElementById('stopButton').setAttribute('onclick', 'sim.removeBodies()');

// window.onload = function() {
//     var gui = new dat.GUI( { autoplace: false, width: 300 });
//     gui.add(circle, 'velocity');
// };
