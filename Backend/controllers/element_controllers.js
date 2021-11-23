const con = require( '../mysql/db' );
const fs = require( 'fs' );





exports.userPosts = ( req, res, next ) => {

    con.query(
        'SELECT * FROM posts',

        function ( err, results ) {
            if ( err ) {
                ( 'Erreur backend sur la route des posts' );
            }
    
            res.status( 200 ).json( results )
            
        } )

}


exports.userComments = ( req, res, next ) => {

    con.query(
        'SELECT * FROM comments C,utilisateurs U WHERE C.utilisateurs_idutilisateurs= U.idutilisateurs  ORDER BY DATE ASC',

        function ( err, results ) {
            if ( err ) {
                console.log( 'Erreur backend sur la route des commentaires du post' );
            }
            res.status( 200 ).json( results )


        } )
}


exports.userAccount = ( req, res, next ) => {



    con.query(
        `SELECT * FROM utilisateurs WHERE idutilisateurs="${ req.body.userid }" AND active='1'`,

        function ( err, results ) {
            if ( err ) {
                console.log( 'Erreur backend route userAccount' );
            }

            res.status( 200 ).json( results )


        } )
}


exports.addcomment = ( req, res, next ) => {
    console.log( req.body )
    const time = new Date().toLocaleTimeString()
    con.query(
        `INSERT INTO comments(commentaires,utilisateurs_idutilisateurs,DATE) VALUES ("${ req.body.commentaire }","${ req.body.userid }","${ time }")`,

        function ( err, results ) {
            if ( err ) {
                console.log( 'Erreur backend sur la route des comments' );
            }

            res.status( 200 ).json( results )


        } )

}

exports.addPosts = ( req, res, next ) => {
    if ( req.file ) {
        req.body.post_img = `${ req.protocol }://${ req.get( 'host' ) }/image/${ req.file.filename }`

        con.query(
            `INSERT INTO posts(post_body,post_img,titre,utilisateurs_idutilisateurs,likes_idlike) VALUES ("${ req.body.post_body }","${ req.body.post_img }","${ req.body.titre }","${ req.body.userid }","${ req.body.userid }")`, function ( err, results ) {
                if ( err ) {
                    console.log( 'Erreur backend sur la route des addposts1' );
                }
                console.log( 'cas1' )
                res.status( 200 ).json( results )


            } )
    } else {
        const img = "https://www.zdnet.fr/zdnet/i/edit/ne/2014/09/the-impact-of-social-media-on-enterprise-apps-600.jpg"
        con.query(
            `INSERT INTO posts(post_body,post_img,titre,utilisateurs_idutilisateurs,likes_idlike) VALUES ("${ req.body.post_body }","${ img }","${ req.body.titre }","${ req.body.userid }","${ req.body.userid }")`, function ( err, results ) {
                if ( err ) {
                    console.log( 'Erreur backend sur la route des addposts2' );
                }
                console.log( req.body )
                res.status( 200 ).json( results )



            } )
    }

}


exports.changeImage = ( req, res, next ) => {
    con.query( `SELECT photo FROM utilisateurs WHERE idutilisateurs= "${ req.body.userid }" AND active='1'`, function ( err, resulting ) {
        if ( err ) {
            console.log( 'Erreur backend sur la route changeImage 1' );
        }
        const removedfile = resulting[0].photo.split( '/image/' )[ 1 ];
        fs.unlink( `image/${ removedfile }`, () => {
           console.log('la précédente image a été supprimée')
        } );
        req.body.image = `${ req.protocol }://${ req.get( 'host' ) }/image/${ req.file.filename }`
        con.query( `UPDATE utilisateurs SET photo = '${ req.body.image }' WHERE idutilisateurs = '${ req.body.userid }'`, function ( err, results ) {
            if ( err ) {
                console.log( 'Erreur backend sur la route changeImage 2' );
            }

            res.status( 200 ).json( results )
        } )


    } )
}


exports.changeMyInfos = ( req, res, next ) => {
    if ( req.body.nom ) {
        con.query( `UPDATE utilisateurs SET nom = "${ req.body.nom }" WHERE idutilisateurs = "${ req.body.userid }" SELECT photo FROM utilisateurs WHERE idutilisateurs= "${ req.body.userid }" AND active='1'`, function ( err, results ) {
            if ( err ) {
                console.log( 'Erreur backend sur la route changeImage' );
            }
            
            res.status( 200 ).json( results )
        } )
    } else if ( req.body.prenom ) {
        con.query( `UPDATE utilisateurs SET prenom = "${ req.body.prenom }" WHERE idutilisateurs = "${ req.body.userid }" AND active='1'`, function ( err, results ) {
            if ( err ) {
                console.log( 'Erreur backend sur la route changeImage' );
            }
            
            res.status( 200 ).json( results )
        } )
    } else if ( req.body.email ) {
        con.query( `UPDATE utilisateurs SET email = "${ req.body.email }" WHERE idutilisateurs = "${ req.body.userid }" AND active='1'`, function ( err, results ) {
            if ( err ) {
                console.log( 'Erreur backend sur la route changeImage' );
            }
            
            res.status( 200 ).json( results )
        } )
    }
}


exports.deletePost = ( req, res, next ) => {
    con.query(
        `SELECT utilisateurs_idutilisateurs,post_img FROM posts WHERE utilisateurs_idutilisateurs="${ req.body.userid }"`,

        function ( err, results ) {
            if ( err ) {
                console.log( 'Erreur backend route userAccount 1' );
            }
            try {
                if ( JSON.stringify( results[ 0 ].utilisateurs_idutilisateurs ) !== req.body.userid ) {
                    console.log( JSON.stringify( results[ 0 ].utilisateurs_idutilisateurs ) )
                } else {
                    con.query( `SELECT post_img FROM posts WHERE TITRE="${ req.body.titre }"`, function ( err, resulted ) {
                        if ( err ) {
                            console.log( 'Erreur backend route userAccount 2' );
                        }
                        const removedfile = resulted[ 0 ].post_img.split( '/image/' )[ 1 ];
                        fs.unlink( `image/${ removedfile }`, () => {
                            console.log( 'la précédente image a été supprimée' )
                        } )
                    })
                        con.query(
                            `DELETE FROM posts WHERE titre="${ req.body.titre }"`,

                            function ( err, resultat ) {
                                if ( err ) {
                                    console.log( 'Erreur backend route userAccount 3' );
                                }
                                console.log( req.body )
                                res.status( 201 ).json( resultat )

                            

                            } )
                
                    }
            } catch { res.status( 200 ).json( 'nope' ) }
            } )


}

exports.deSactivate = ( req, res, next ) => {
    
    con.query( `UPDATE utilisateurs SET prenom='anonyme', active="${ req.body.value }" WHERE idutilisateurs="${ req.body.userid}"`, function ( err, resulted ) {
        if ( err ) {
            console.log( 'Erreur backend route deSactivate' );
        }
    })

}