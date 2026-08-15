import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

export default function PosicaoGPSScreen() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [locaReal, setLocaReal] = useState(null);

    useEffect(() => {
        async function getCurrentLocation() {
            // Solicita permissão para acessar a localização
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setErrorMsg("Permissão de localização negada.");
                return;
            }

            try {
                // Obtém a localização atual
                const tempLocation =
                    await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.High,
                    });

                setLocation(tempLocation);

                // Pega latitude e longitude do objeto q vem do tempLocation;
                const { latitude, longitude } = tempLocation.coords;

                // Converte coordenadas em endereço
                await reverseEngLocation({
                    latitude,
                    longitude,
                });
            } catch (error) {
                console.error(error);
                setErrorMsg("Não foi possível obter a localização.");
            }
        }

        async function reverseEngLocation(coordenadas) {
            try {
                const endereco =
                    await Location.reverseGeocodeAsync(coordenadas);

                if (!endereco || endereco.length === 0) {
                    setErrorMsg("Endereço não encontrado.");
                    return;
                }
                console.log(endereco)
                // Primeiro resultado encontrado
                setLocaReal(endereco[0]);
            } catch (error) {
                console.error(error);
                setErrorMsg("Não foi possível encontrar o endereço.");
            }
        }

        getCurrentLocation();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.titleScreen}>
                        Posição Atual
                    </Text>
                </View>

                {errorMsg ? (
                    <Text style={styles.error}>
                        {errorMsg}
                    </Text>
                ) : location ? (
                    <View style={styles.card}>

                        <Text style={styles.label}>
                            Latitude
                        </Text>
                        <Text style={styles.value}>
                            {location.coords.latitude}
                        </Text>

                        <Text style={styles.label}>
                            Longitude
                        </Text>
                        <Text style={styles.value}>
                            {location.coords.longitude}
                        </Text>

                        <Text style={styles.label}>
                            Altitude
                        </Text>
                        <Text style={styles.value}>
                            {location.coords.altitude
                                ? `${location.coords.altitude.toFixed(2)} m`
                                : "Não disponível"}
                        </Text>

                        {locaReal && (
                            <>
                                <Text style={styles.label}>
                                    Rua
                                </Text>
                                <Text style={styles.value}>
                                    {locaReal.street || "Não informado"}
                                </Text>

                                <Text style={styles.label}>
                                    Número
                                </Text>
                                <Text style={styles.value}>
                                    {locaReal.streetNumber || "Não informado"}
                                </Text>

                                <Text style={styles.label}>
                                    Bairro
                                </Text>
                                <Text style={styles.value}>
                                    {locaReal.district || "Não informado"}
                                </Text>

                                <Text style={styles.label}>
                                    CEP
                                </Text>
                                <Text style={styles.value}>
                                    {locaReal.postalCode || "Não informado"}
                                </Text>

                                <Text style={styles.label}>
                                    Cidade
                                </Text>
                                {/*Operação ternária caso nn haja cidade ou subregião, nos testes Sumaré fica como subregião */}

                                {/**LOG DE EXEMPLO:
                                 * 
                                 *  LOG  [
                                 * {"city": null, 
                                 * "country": "Brazil", 
                                 * "district": "Parque Emilia",
                                 * "formattedAddress": "R. João Fabri, 1 - Parque Emilia, Sumaré - SP, 13171-174, Brazil", 
                                 * "isoCountryCode": "BR", 
                                 * "name": "1", 
                                 * "postalCode": "13171-174", 
                                 * "region": "São Paulo", 
                                 * "street": "Rua João Fabri", 
                                 * "streetNumber": "1", 
                                 * "subregion": "Sumaré", 
                                 * "timezone": null
                                 * }
                                 * ]
                                 * 
                                 */}
                                <Text style={styles.value}>
                                    {locaReal.city ?
                                        locaReal.city :
                                        locaReal.subregion || "Não informado"}
                                </Text>

                                <Text style={styles.label}>
                                    Estado
                                </Text>
                                <Text style={styles.value}>
                                    {locaReal.region || "Não informado"}
                                </Text>

                                <Text style={styles.label}>
                                    País
                                </Text>
                                <Text style={styles.value}>
                                    {locaReal.country || "Não informado"}
                                </Text>
                            </>
                        )}

                    </View>
                ) : (
                    <Text style={styles.paragraph}>
                        Obtendo localização...
                    </Text>
                )}

            </View>
        </SafeAreaView>
    );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6f6f6",
        padding: 20,
    },

    header: {
        paddingTop: 20,
        paddingBottom: 20,
    },

    titleScreen: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1E293B",
        textAlign: "center",
    },

    paragraph: {
        fontSize: 18,
        textAlign: "center",
        color: "#64748B",
        marginTop: 20,
    },

    error: {
        fontSize: 18,
        textAlign: "center",
        color: "#b12727",
        marginTop: 20,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        elevation: 3,
    },

    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#64748B",
        marginTop: 12,
    },

    value: {
        fontSize: 17,
        color: "#1E293B",
        marginTop: 3,
    },

    safeArea: {
        flex: 1,
        backgroundColor: "#F6F7F8",
    },
});