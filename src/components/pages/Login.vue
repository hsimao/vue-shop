<template>
	<div>
		<form class="form-signin" @submit.prevent="signin">
			<div class="text-center mb-4">
				<h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
			</div>

			<div class="form-label-group">
				<input v-model="user.username" type="email" class="form-control" placeholder="Email address" required="" autofocus="">
			</div>

			<div class="form-label-group">
				<input v-model="user.password" type="password" class="form-control" placeholder="Password" required="">
			</div>

			<div class="checkbox mb-3">
				<label>
						<input type="checkbox" value="remember-me"> Remember me
				</label>
			</div>
			<button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
			<p class="mt-5 mb-3 text-muted text-center">© 2017-2018</p>
		</form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			user: {
				username: '',
				password: '',
			}
		}
	},
	methods: {
		signin() {
		const api = `${process.env.APIPATH}/signin`;
		const vm = this
		this.$http.post(api, vm.user).then((res) => {
			console.log(res.data);
			if (res.data.success) {
				vm.$router.push('/admin/products')
			}
		});
		},
	},
};
</script>

<style scoped>
html,
body {
	height: 100%;
}

body {
	display: -ms-flexbox;
	display: flex;
	-ms-flex-align: center;
	align-items: center;
	padding-top: 40px;
	padding-bottom: 40px;
	background-color: #f5f5f5;
}

.form-signin {
	width: 100%;
	max-width: 420px;
	padding: 15px;
	margin: auto;
}

.form-label-group {
	position: relative;
	margin-bottom: 1rem;
}

.form-label-group > input,
.form-label-group > label {
	padding: .75rem
}

.form-label-group > label {
	position: absolute;
	top: 0;
	left: 0;
	display: block;
	width: 100%;
	margin-bottom: 0; /* Override default `<label>` margin */
	line-height: 1.5;
	color: #495057;
	border: 1px solid transparent;
	border-radius: .25rem;
	transition: all .1s ease-in-out;
}

.form-label-group input:not(:placeholder-shown) {
	padding-top: calc(var(.75rem) + var(.75rem) * (2 / 3));
	padding-bottom: calc(var(.75rem) / 3);
}

.form-label-group input:not(:placeholder-shown) ~ label {
	padding-top: calc(var(.75rem) / 3);
	padding-bottom: calc(var(.75rem) / 3);
	font-size: 12px;
	color: #777;
}

</style>
