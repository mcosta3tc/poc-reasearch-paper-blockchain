import React from 'react';
import { Button, Grid, Input, Spacer } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { useAddress, useConnect } from '@thirdweb-dev/react';
import { ChainId, ListingType, type Marketplace, ThirdwebSDK } from '@thirdweb-dev/sdk'
import Header from '../components/Header'



type formDataType = {
    count: number
    name: string,
    address: string,
    size:number,
}

export enum InputEvent {
    NAME = "name",
    ADDRESS = "address",
    SIZE = "size",
    COUNT = "count",
}

const NftDrop = () => {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<formDataType>();
    const sdkAdmin = ThirdwebSDK.fromPrivateKey( process.env.NEXT_PUBLIC_SDK_PK || '', 'goerli' )
    const [ { data } ] = useConnect();
    const connectedAddress = useAddress();


    /*    async function saveFormData( data: formDataType ) {
            return await fetch( "http://localhost:5000/create-drop", {
                body: JSON.stringify( data ),
                headers: { "Content-Type": "application/json" },
                method: "POST"
            } )
        }*/

    const onSubmit = async ( formData: formDataType ) => {
        /*const response = await saveFormData( data )

        if ( response.status === 400 ) {
            // Validation error
        } else if ( response.ok ) {
            // successful
        } else {
            // unknown error
        }*/


        if ( data.connected ) {
            const collectionContractAddress = await sdkAdmin?.deployer.deployNFTCollection( {
                name: formData.name,
                primary_sale_recipient: connectedAddress || '',
            } );

            console.log( "COLLECTION" )
            const contract = await sdkAdmin?.getContract( collectionContractAddress || '', 'nft-collection' )


            console.log( "CONTRACT" )

            const metaData = {
                name: formData.name,
                properties: {
                    size:formData.size,
                    address:formData.address
                }
            }
            const metaDatas = []

            for ( let i = 0; i < formData.count; i++ ) {
                metaDatas.push( metaData )
            }

            const mintTransaction = await contract?.mintBatchTo( connectedAddress || '', metaDatas );
            for (const nftObject of mintTransaction) {
                console.log(nftObject.id)
            }
            console.log(contract.erc721.getAddress())

            console.log( "mint" )
        } else {
            console.log( 'no connected wallet' )
        }
    }

    return (
            <>
                <Header></Header>
                <Grid.Container justify={ 'center' } css={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <form onSubmit={ handleSubmit( onSubmit ) }>
                        <Input size={ "md" }
                               clearable
                               bordered
                               color={ "primary" }
                               labelPlaceholder="Nom"
                               { ...register( InputEvent.NAME, { required: true } ) }
                        />
                        <Input size={ "md" }
                               clearable
                               bordered
                               color={ "primary" }
                               labelPlaceholder="Adresse"
                               { ...register( InputEvent.ADDRESS, { required: true } ) }
                        />
                        <Input size={ "md" }
                               clearable
                               bordered
                               color={ "primary" }
                               labelPlaceholder="Taille"
                               { ...register( InputEvent.SIZE, { required: true } ) }
                        />
                        <Input size={ "md" }
                               clearable
                               bordered
                               color={ "primary" }
                               labelPlaceholder="Nombre"
                               { ...register( InputEvent.COUNT, { required: true } ) }
                        />
                        <Spacer y={ 2 }/>
                        <Button type="submit">{ isSubmitting ? 'Loading' : "Submit" }</Button>
                    </form>
                </Grid.Container>
            </>
    );
}

export default NftDrop;
