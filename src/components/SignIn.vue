<template>
	<div class="login-box">
		<h1>SignIn</h1>
		<div class="container content">
			<p>Sign in to start your session</p>
			<form method="post" action="/">
				<input id="email" type="email" placeholder="Email" required>
				<input id="pass" type="password" placeholder="Password" required>
				<div class="below-box">
					<div class="pull-right">
						<button class="btn-blue"> Sign In </button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import '../styles/variables.scss';

.login-box  {
	padding-top: 80px;

	h1 {
		color: #444444;
		text-align: center;
	}

	.content {
		max-width: 400px;
		min-height: 350px;

		background: white;
		margin-top: 40px;
		border: 1px solid #E2E5EB;
		padding: 20px;

		input {
			width: 100%;
			color: #C0C0C0;
			margin-top: 15px;
			border-radius: 0;
			border: 1px solid #C0C0C0;
			height: 40px;
			padding: 15px;
			font-size: 14px;
		}

		input::placeholder {
		  color: #666;
		}	

		.checkbox {
			background: white;
		    height: 30px;
		    border: 1px solid #C0C0C0;
		    border-radius: 0;
		    width: initial;
		    margin-top: 0;
		}
		
		p {
			color: #757575;
			font-size: 14px;
			margin-bottom: 0;
			padding: 5px 0;
		}

		.rememberme {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 14px;
			position: relative;
			top: 0;
			margin:10px;
		}

		button {
			background: #3c8dbc;	
			color: white;
			font-size: 14px;		
			border: 1px solid #3380AD; 
			background: #3c8dbc;
			color: white;
			font-size: 14px;
			border: 1px solid #3380AD;
			padding: 8px 25px;		
			cursor: pointer;
			width: 100%;
			margin-top: 15px;	
		}

		a {
			color: #8ABDDA;
			font-size: 14px;
		}
		
	}

}

</style>
