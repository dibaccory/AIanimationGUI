function renderBlock() {
	let geometry = new THREE.BoxGeometry(220, 220, 40);
	let colors = new THREE.Color( 0, 0, 1 );
	let material = new THREE.MeshLambertMaterial( { color: colors } );
	let block = new THREE.Mesh( geometry, material );
	block.position.y += 300;
	block.position.z -= 250;

	scene.add( block );
}