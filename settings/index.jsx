function GarageOpenerSettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Garage opener settings</Text>}>
        <Text>
          This is a very basic demo settings page to show off some of the current
          capabilities of the Companion Settings library.
        </Text>
        <TextInput
          label="Relay IP address"
          settingsKey="relayIp"
          placeholder="..1.45"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(GarageOpenerSettings);