import React, {useState} from 'react';
import { Button, Grid, Input, Spacer } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { useAddress, useConnect } from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import Header from '../components/Header'



type formDataType = {
    count: number
    name: string,
    address: string,
    size:number,
    image:string,
}

export enum InputEvent {
    NAME = "name",
    ADDRESS = "address",
    SIZE = "size",
    COUNT = "count",
    IMAGE = "image"
}

const NftDrop = () => {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<formDataType>();
    const [isLoading,setIsLoading] = useState(false)
    const [contractAddress,setContractAddress] = useState('')
    const sdkAdmin = ThirdwebSDK.fromPrivateKey( process.env.NEXT_PUBLIC_SDK_PK || '', 'mumbai' )
    const [ { data } ] = useConnect();
    const connectedAddress = useAddress();

    const onSubmit = async ( formData: formDataType ) => {
        setIsLoading(true)

        if ( data.connected ) {
            console.log(connectedAddress)
            const collectionContractAddress = await sdkAdmin?.deployer.deployNFTCollection( {
                name: formData.name,
                primary_sale_recipient: connectedAddress || '',
            } );

            console.log( "COLLECTION" )
            const contract = await sdkAdmin?.getContract( collectionContractAddress || '', 'nft-collection' )


            console.log( "CONTRACT" )

            const metaData = {
                name: formData.name,
                image:formData.image,
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
                console.log(nftObject.id.toString())
            }
            console.log(contract.erc721.getAddress())
            setContractAddress(contract.erc721.getAddress())

            console.log( "mint" )
            setIsLoading(false)

        } else {
            setIsLoading(false)

            console.log( 'no connected wallet' )
        }
    }

    return (
            <>
                <Header></Header>
                <Grid.Container justify={ 'center' } css={{display:'flex',justifyContent:'center',alignItems:'center',gap:'5',height:'1000px'}}>
                    <form onSubmit={ handleSubmit( onSubmit ) } id="form">
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
                               labelPlaceholder="Image"
                               { ...register( InputEvent.IMAGE, { required: true } ) }
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
                        <Button type="submit" disabled={isLoading}>{ isLoading ? 'Loading' : "Submit" }</Button>
                        {contractAddress}
                    </form>
                </Grid.Container>
            </>
    );
}

export default NftDrop;
