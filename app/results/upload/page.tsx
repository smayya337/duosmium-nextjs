export default function Page() {
	return (
		<form action="/results/add/submit" method="POST" encType="multipart/form-data">
			<label htmlFor="yaml">Upload YAML file:</label>
			<input type="file" name="yaml" id="yaml" accept=".yaml,.yml" multiple />
			<br />
			<input type="submit" value="Submit" />
		</form>
	);
}
