// module aliases
let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events;
    Vector = Matter.Vector;

// create a gui
let gui = new dat.GUI({ autoplace: false, width: 200 });
// gui.domElement.id = 'gui';
let customContainer = $('.datgui').append($(gui.domElement));

// create an engine
let engine = Engine.create(),
    world = engine.world;

// set gravity to 0
world.gravity.y = 0;

// colors
let redColor = '#C44D58',
    blueColor = '#4ECDC4',
    greenColor = '#C7F464',
    greyColor = '#696969';

// get element
let canvas = document.getElementById('sandbox');

// create a renderer
let render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        showVelocity: true,
        wireframes: false
    }
});


let circle = Bodies.circle(100, 100, 10,
    {restitution: 1, frictionAir: 0, friction: 0, slop: 0, frictionStatic: 0,
        render: { fillStyle: redColor}});
Matter.Body.setVelocity(circle, Matter.Vector.create(Math.random(), Math.random()));

// add all bodies
World.add(world, [
    // flying body
    circle,

    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true, restitution: 1,
        render: {fillStyle: greyColor}}),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true, restitution: 1,
        render: {fillStyle: greyColor}}),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true, restitution: 1,
        render: {fillStyle: greyColor}}),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true, restitution: 1,
        render: {fillStyle: greyColor}})
]);

// add mouse control
let mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// variables for plotting
let v,
    p,
    f,
    m,
    a;

// keep the mouse in sync with rendering
render.mouse = mouse;

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

gui.add(circle.velocity, 'x', 0, 10).name('x-velocity');
gui.add(circle.velocity, 'y', 0, 10).name('y-velocity');
// gui.add(circle.position, 'x', 0, 800).name('x-position');
// gui.add(circle.position, 'y', 0, 600).name('y-position');
gui.add(circle.force, 'x', -0.1, 0.1).name('x-force');
gui.add(circle.force, 'y', -0.1, 0.1).name('y-force');
gui.add(circle, 'mass', 0, 10).name('mass');

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
params = [{'cst': 'v^2', 'color': 'steelblue', 'value': 'Vector.magnitude(v)'}, {'cst': '=', 'color': 'white', 'value': null},
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
Events.on(render, 'afterRender', function get_vars() {
        v = circle.velocity;
        p = circle.position;
        f = circle.force;
        m = circle.mass;
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

// window.onload = function() {
//     var gui = new dat.GUI( { autoplace: false, width: 300 });
//     gui.add(circle, 'velocity');
// };
