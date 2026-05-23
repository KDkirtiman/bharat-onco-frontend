export const defaultPlaygroundCode = `function Demo() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
      <Title level={2}>Composition demo</Title>
      <MutedText>Edit this code to combine multiple components.</MutedText>
      <TextField
        label="Patient name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button onClick={() => setOpen(true)} disabled={!name}>
          Open modal
        </Button>
        <Badge tone="info">Draft</Badge>
      </div>
      <Modal open={open} onOpenChange={setOpen} size="sm">
        <Modal.Header>Confirm</Modal.Header>
        <Modal.Body>
          <Text>Proceed with {name}?</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
      <Banner tone="info" dismissible>
        Tip: try Checkbox, Switch, or Select from the design system scope.
      </Banner>
    </div>
  );
}

render(<Demo />);
`;
