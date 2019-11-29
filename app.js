{
  let requestID = '';

  const canvasConfiguration = {
    maxShapes: 50,
    props: ['circle', 'rectangle', 'line', 'triangle'],
    colors: ['green', 'red', 'blue', 'purple', 'gold', '#69E8FA', '#FF223F', '#FF71DB', 'bisque'],
    speed: 10,
    maxRotate: 50,
  };

  const renderShapesOnCanvas = (ctx, particle) => {
    switch (particle.shape) {
      case 'circle': {
        ctx.beginPath();
        ctx.arc(particle.xAxis, particle.yAxis, 5, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.translate(particle.xAxis, particle.yAxis);
        break;
      }
      case 'rectangle': {
        ctx.translate(particle.xAxis, particle.yAxis);
        ctx.rotate(particle.rotate * Math.PI / 180);
        ctx.fillRect(particle.xAxis, 0, 5, 10);
        break;
      }
      case 'line': {
        ctx.beginPath();
        ctx.moveTo(particle.xAxis, particle.yAxis);
        ctx.lineTo(particle.xAxis + 5, particle.yAxis + 20);
        ctx.lineWidth = 5;
        ctx.strokeStyle = particle.color;
        ctx.stroke();
        break;
      }
      case 'triangle': {
        ctx.beginPath();
        ctx.moveTo(particle.xAxis, particle.yAxis);
        ctx.lineTo(particle.xAxis + 15, particle.yAxis + 15);
        ctx.lineTo(particle.xAxis, particle.yAxis + 30);
        ctx.fill();
        break;
      }
    };
  };

  const getRandomNumber = (size) => Math.floor(Math.random() * size);

  const getConfettiShapes = (config) => {
    const shapes = [];

    for (let i = 0; i < config.maxShapes; i++) {
      shapes.push({
        xAxis: getRandomNumber(window.innerWidth),
        yAxis: 0,
        shape: config.props[getRandomNumber(config.props.length)],
        color: config.colors[getRandomNumber(config.colors.length)],
        speed: getRandomNumber(config.speed) || 5,
        rotate: getRandomNumber(config.maxRotate),
      });
    }

    return shapes;
  };

  const clearCanvas = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawShapes = (shapes, ctx, canvas, config) => {
    clearCanvas(ctx, canvas);

    for (let i = 0; i < config.maxShapes; i++) {
      if (shapes[i].yAxis >= canvas.height) {
        shapes[i].yAxis = 0;
      }
      shapes[i].yAxis = shapes[i].yAxis + shapes[i].speed;
      
      ctx.save();
      ctx.fillStyle = shapes[i].color;
      renderShapesOnCanvas(ctx, shapes[i]);
      ctx.restore();
    }

    requestID = window.requestAnimationFrame(drawShapes.bind(null, shapes, ctx, canvas, config));
  };

  const render = (config, canvas, ctx) => {
    const shapes = getConfettiShapes(config);
    requestID = window.requestAnimationFrame(drawShapes.bind(null, shapes, ctx, canvas, config));
  };

  const startConfetti = (config, canvas, ctx) => {
    requestID = render(config, canvas, ctx);
  };

  const stopConfetti = (ctx) => {
    cancelAnimationFrame(requestID);
    clearCanvas(ctx, canvas);
  };

  const main = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const start = document.getElementById('start');
    const stop = document.getElementById('stop');

    start.addEventListener('click', () => {
      startConfetti(canvasConfiguration, canvas, ctx);
    });

    stop.addEventListener('click', () => {
      stopConfetti(ctx, canvas);
    });
  };

  main();
}
