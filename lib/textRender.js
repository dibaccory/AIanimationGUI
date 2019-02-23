function renderText( scene, group, position = null, name = null ) {

	var loader = new THREE.FontLoader();


    if (name.includes("conv"))
    {
    	loader.load( 'lib/helvetiker_regular.typeface.json', function ( font ) {

    	var textGeo = new THREE.TextGeometry( "Convolution", {

            font: font,

            size: 15,
            height: 5,
            curveSegments: 12,

            bevelThickness: 1,
            bevelSize: 1,
            bevelEnabled: true

    	} );

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( 40, position.y+10, position.z );
        mesh.rotateY(Math.PI / 2);
        scene.add( mesh );
        group.add( mesh );
    	} );
    }

    if(name.includes("pool"))
    {
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( 20, position.y+10, position.z );
        mesh.rotateY(Math.PI / 2);
        scene.add( mesh );
        group.add( mesh );
    	} );
    }

    if (name.includes("dense"))
    {
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( 10, 30, position.z+20 );
        mesh.rotateY(Math.PI / 2);
        scene.add( mesh );
        group.add( mesh );
    	} );
    }

    if (name.includes("output"))
    {
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( 10, 30, position.z+20 );
        mesh.rotateY(Math.PI / 2);
        scene.add( mesh );
        group.add( mesh );
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( -64, 10, position.z );
        scene.add( mesh );
        group.add( mesh );
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( -52, 10, position.z );
        scene.add( mesh );
        group.add( mesh );
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( -40, 10, position.z );
        scene.add( mesh );
        group.add( mesh );
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( -28, 10, position.z );
        scene.add( mesh );
        group.add( mesh );
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( -16, 10, position.z );
        scene.add( mesh );
        group.add( mesh );
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( -4, 10, position.z );
        scene.add( mesh );
        group.add( mesh );
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( 8, 10, position.z );
        scene.add( mesh );
        group.add( mesh );
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( 20, 10, position.z );
        scene.add( mesh );
        group.add( mesh );
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( 32, 10, position.z );
        scene.add( mesh );
        group.add( mesh );
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

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xbbbbbb } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set( 44, 10, position.z );
        scene.add( mesh );
        group.add( mesh );
        } );
    }

    return {scene: scene, group: group};
}