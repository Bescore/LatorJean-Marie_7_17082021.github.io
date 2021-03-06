const bcrypt = require( 'bcrypt' );
const con = require( '../mysql/db' )
const jwt = require( 'jsonwebtoken' )

//CREATION D'UTILISATEUR//
exports.signup = async ( req, res, next ) => {
    const hashy = await bcrypt.hash( req.body.password, 10 )
    const photo = `https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/User_with_smile.svg/1200px-User_with_smile.svg.png`
   
    con.query( `SELECT  email FROM utilisateurs WHERE email='${ req.body.email }' AND active='1'`, function ( err, resultation ) {
        if ( err ) {
            console.log( 'Erreur 1 sur la route de login' )
        }
        if ( resultation[0]!==undefined ) {
            res.status( 200 ).json( "email présent dans la base" )
        } else { 
        con.query( `INSERT INTO utilisateurs(nom,prenom,md_passe,email,photo,active) VALUES("${ req.body.nom }","${ req.body.prenom }","${ hashy }","${ req.body.email }","${ photo }",'1')`, function ( err, result ) {

        } );
        con.query( `SELECT idutilisateurs FROM utilisateurs WHERE email='${ req.body.email }'`, function ( err, result ) {
            if ( err ) {
                console.log( 'Erreur sur 1 la route de crétation utilisateur' )
            }
            res.status( 200 ).json( {
                token: jwt.sign(
                    { userId: result }, 'RANDOM_TOKEN_SECRET', { expiresIn: '2700s' }
                ),
                userId: result
            } )

        } )
            
        };
    })
}

//LOGIN, CONTRÔLE D'ACCÈS UTILISATEUR//
exports.login = ( req, res, next ) => {

    con.query( `SELECT  idutilisateurs,md_passe FROM utilisateurs WHERE email='${ req.body.email }' AND active='1'`, function ( err, resulting ) {
        if ( err ) {
            console.log( 'Erreur 1 sur la route de login' )
        }
        try {
            if ( resulting[ 0 ].idutilisateurs !== undefined ) {
                const idUser = resulting[ 0 ].idutilisateurs
                const hashedPassw = resulting[ 0 ].md_passe
                bcrypt.compare( req.body.password, hashedPassw )
                    .then( valid => validate( valid ) )

                const validate = ( valid ) => {
                    if ( valid ) {
                        res.status( 200 ).json( {
                            token: jwt.sign(
                                { userId: idUser }, 'RANDOM_TOKEN_SECRET', { expiresIn: '2700s' }
                            ),
                            userId: idUser
                        } )
                    } else {
                        res.status( 400 ).json( 'mauvais mot de passe' )
                    }
                }
            }
        } catch { res.status( 401 ).json( { message: 'adresse non reconnue' } ) }
    } )



}


