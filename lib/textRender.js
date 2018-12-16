function renderText( scene ) {

	var loader = new THREE.FontLoader();

	loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

	var textGeo = new THREE.TextGeometry( "First Convolution", {

        font: font,

        size: 25,
        height: 10,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

	} );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 120, 150, -150 );
    mesh.rotateY(Math.PI / 2);
    scene.add( mesh );
	} );

	loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

	var textGeo = new THREE.TextGeometry( "Max Pool", {

        font: font,

        size: 25,
        height: 10,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

	} );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 50, 75, -400 );
    mesh.rotateY(Math.PI / 2);
    scene.add( mesh );
	} );

	loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

	var textGeo = new THREE.TextGeometry( "2nd Convolution", {

        font: font,

        size: 15,
        height: 5,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

	} );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 40, 50, -610 );
    mesh.rotateY(Math.PI / 2);
    scene.add( mesh );
	} );

	loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

	var textGeo = new THREE.TextGeometry( "Max Pool", {

        font: font,

        size: 15,
        height: 5,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

	} );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 20, 30, -840 );
    mesh.rotateY(Math.PI / 2);
    scene.add( mesh );
	} );

	loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

	var textGeo = new THREE.TextGeometry( "Dense", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

	} );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 10, 30, -1030 );
    mesh.rotateY(Math.PI / 2);
    scene.add( mesh );
	} );

	loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

	var textGeo = new THREE.TextGeometry( "Output", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

	} );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 10, 30, -1125 );
    mesh.rotateY(Math.PI / 2);
    scene.add( mesh );
	} );

    loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

    var textGeo = new THREE.TextGeometry( "0", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( -64, 10, -1152 );
    scene.add( mesh );
    } );

    loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

    var textGeo = new THREE.TextGeometry( "1", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( -52, 10, -1152 );
    scene.add( mesh );
    } );

    loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

    var textGeo = new THREE.TextGeometry( "2", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( -40, 10, -1152 );
    scene.add( mesh );
    } );

    loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

    var textGeo = new THREE.TextGeometry( "3", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( -28, 10, -1152 );
    scene.add( mesh );
    } );

    loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

    var textGeo = new THREE.TextGeometry( "4", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( -16, 10, -1152 );
    scene.add( mesh );
    } );

    loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

    var textGeo = new THREE.TextGeometry( "5", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( -4, 10, -1152 );
    scene.add( mesh );
    } );

    loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

    var textGeo = new THREE.TextGeometry( "6", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 8, 10, -1152 );
    scene.add( mesh );
    } );

    loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

    var textGeo = new THREE.TextGeometry( "7", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 20, 10, -1152 );
    scene.add( mesh );
    } );

    loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

    var textGeo = new THREE.TextGeometry( "8", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 32, 10, -1152 );
    scene.add( mesh );
    } );

    loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

    var textGeo = new THREE.TextGeometry( "9", {

        font: font,

        size: 10,
        height: 2,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( 44, 10, -1152 );
    scene.add( mesh );
    } );

    return scene;
}