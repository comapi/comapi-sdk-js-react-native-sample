import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Button, NativeModules } from 'react-native';

import FoundationService from "./foundationService"

const ProfileScreen = ({ }) => {

    const [profile, setProfile] = useState(null);

    useEffect(() => {

        async function getProfile() {
            if (profile === null) {
                const p = await FoundationService.getProfile();
                setProfile(p)
            }
        }
        getProfile();
    });

    return (
        <View>
            <Text>{JSON.stringify(profile, null, 4)}</Text>
        </View>
    );
};

export default ProfileScreen;