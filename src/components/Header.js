import React from 'react';
import {Link, Navbar, Spacer, Text} from '@nextui-org/react';
import {Logo} from './logo/Logo';
import {ConnectWallet} from '@thirdweb-dev/react';


export function Header() {
    const collapseItems = [
        'Profile',
        'Dashboard',
        'Activity',
        'Analytics',
        'System',
        'Deployments',
        'My Settings',
        'Team Settings',
        'Help & Feedback',
        'Log Out',
    ];

    return (
        <>
            <Navbar isBordered variant="sticky" maxWidth={'fluid'}>
                <Navbar.Toggle showIn="xs"/>
                <Navbar.Brand
                    css={{
                        '@xs': {
                            w: '12%',
                        },
                    }}
                >
                    <Logo/>
                    <Spacer x={1}></Spacer>
                    <Text b color="inherit" hideIn="xs">
                        Estate Papers
                    </Text>
                </Navbar.Brand>
                <Navbar.Content
                    enableCursorHighlight
                    activeColor="secondary"
                    hideIn="xs"
                    variant="highlight-rounded"
                >
                    <Navbar.Link isActive href="/create-nft">Create Contract</Navbar.Link>
                    <Navbar.Link href="/">Home</Navbar.Link>
                </Navbar.Content>
                <Navbar.Content
                    css={{
                        '@xs': {
                            w: '12%',
                            jc: 'flex-end',
                        },
                    }}
                >
                    <ConnectWallet
                        btnTitle="Connectez votre wallet"
                        colorMode={'dark'}
                    />
                </Navbar.Content>
                <Navbar.Collapse>
                    {collapseItems.map((item, index) => (
                        <Navbar.CollapseItem
                            key={item}
                            activeColor="secondary"
                            css={{
                                color: index === collapseItems.length - 1 ? '$error' : '',
                            }}
                            isActive={index === 2}
                        >
                            <Link
                                color="inherit"
                                css={{
                                    minWidth: '100%',
                                }}
                                href="#"
                            >
                                {item}
                            </Link>
                        </Navbar.CollapseItem>
                    ))}
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}

export default Header;
