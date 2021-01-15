const app = require("express")();
app.get("/", (_, res) => {
 res.send(`
	<style>
		body{
			margin: 0;
			padding: 0;
			min-height: 100vh;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #031321;
			font-family: consolas;
		}
		a {
			position: relative;
			display: inline-block;
			padding: 15px 30px;
			color: red;
			text-transform: uppercase;
			letter-spacing: 4px;
			text-decoration: none;
			font-size: 24px;
			overflow: hidden;
			transition: 0.2s;
		}
		a:hover {
			color: #255784;
			background: red;
			box-shadow: 0 0 10px red, 0 0 40px red, 0 0 80px red;
			transition-delay: 1s;
		}
		a span {
			position: absolute;
			display: block;
		}
		a span:nth-child(1) {
			top: 0;
			left: -100%;
			width: 100%;
			height: 2px;
			background: linear-gradient(90deg, transparent, red)
		}
		a:hover span:nth-child(1) {
			left: 100%;
			transition: 1s;
		}
		a span:nth-child(3) {
			bottom: 0;
			right: -100%;
			width: 100%;
			height: 2px;
			background: linear-gradient(270deg, transparent, red)
		}
		a:hover span:nth-child(3) {
			right: 100%;
			transition-delay: 0.5s;
			transition: 1s;
		}
		a span:nth-child(2) {
			top: -100%;
			right: 0;
			width: 2px;
			height: 100%;
			background: linear-gradient(180deg, transparent, red)
		}
		a:hover span:nth-child(2) {
			top: 100%;
			transition-delay: 0.25s;
			transition: 1s;
		}
		a span:nth-child(4) {
			bottom: -100%;
			left: 0;
			width: 2px;
			height: 100%;
			background: linear-gradient(360deg, transparent, red)
		}
		a:hover span:nth-child(4) {
			bottom: 100%;
			transition-delay: 0.75s;
			transition: 1s;
		}
	</style>
	<a herf="#"; onclick="poop()">
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		By being on this website, you're keeping the bot online.
	</a>
 `)
});
app.listen(8080);