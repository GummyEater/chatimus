import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField } from "@mui/material";
import * as React from "react";
import { createAccountAsync } from "../../app/accounts/accountsSlice";
import { setCreateAnonymousDialogOpen } from "../../app/appstate/appSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./CreateAnonymousDialog.scss";
import crypto from "crypto-js";

function CreateAnonymousDialog() {
  const dialogOpen = useAppSelector((state) => state.appstate.data.createAnonymousDialogOpen);
  const accounts = useAppSelector((state) => state.accounts.data.accounts);
  const currAccount = useAppSelector((state) => state.accounts.data.currAccount);
  const [username, setUsername] = React.useState("");
  const [secretQuestion, setSecretQuestion] = React.useState("Select a Secret Question");
  const [secretAnswer, setSecretAnswer] = React.useState("");
  const dispatch = useAppDispatch();

  const singupAnonymously = () => {
    if (secretQuestion !== "Select a Secret Question") {
      let newAccInfo = {
        accType: "anonymous",
        username: username,
        email: "",
        passHash: "",
        numAccounts: accounts.length,
        selectedTheme: "default",
        secretQuestion: secretQuestion,
        secretAnswer: secretAnswer,
      };
      if (currAccount !== -1) {
        newAccInfo.selectedTheme = accounts[currAccount].accState.selectedTheme;
      }
      setSecretQuestion("Select a Secret Question");
      setSecretAnswer("");
      dispatch(createAccountAsync(newAccInfo));
      dispatch(setCreateAnonymousDialogOpen(false));
    }
  };

  const changedUsername = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const changedSecretAnswer = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSecretAnswer(event.target.value);
  };

  const changedSecretQuestion = (event: SelectChangeEvent) => {
    setSecretQuestion(event.target.value as string);
  };

  return (
    <Dialog open={dialogOpen} onClose={(event) => dispatch(setCreateAnonymousDialogOpen(false))} sx={{ overflow: "hidden" }}>
      <DialogTitle>Add a New Anonymous Account</DialogTitle>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Paper elevation={3} sx={{ padding: 2, margin: 3, marginRight: 1.5, width: "250px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <DialogContentText variant="subtitle2">Secret Question</DialogContentText>
            <br />
            {secretQuestion === "Select a Secret Question" ? (
              <div>
                <Select labelId="demo-simple-select-label" value={secretQuestion} label="Secret Question" onChange={(event) => changedSecretQuestion(event)}>
                  <MenuItem sx={{ visibility: "hidden", display: "none" }} value={"Select a Secret Question"}>
                    Select a Secret Question
                  </MenuItem>
                  <MenuItem value={"What is your favorite color?"}>What is your favorite color?</MenuItem>
                  <MenuItem value={"What is your favorite ice cream flavor?"}>What is your favorite ice cream flavor?</MenuItem>
                  <MenuItem value={"Which phone brand do you like the most?"}>Which phone brand do you like the most?</MenuItem>
                </Select>
              </div>
            ) : (
              <div>
                <TextField autoFocus={true} label={secretQuestion} type="text" variant="outlined" onChange={(event) => changedSecretAnswer(event)} />
              </div>
            )}
          </div>
        </Paper>
        <Paper elevation={3} sx={{ padding: 2, margin: 3, marginLeft: 1.5, width: "250px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <DialogContentText variant="subtitle2">A Username for your Account</DialogContentText>
            <br />
            <TextField fullWidth={true} autoFocus={true} label="Username" type="text" variant="outlined" onChange={(event) => changedUsername(event)} />
          </div>
        </Paper>
      </div>
      <Button sx={{ margin: 3, padding: 2 }} variant="contained" onClick={singupAnonymously}>
        Create Anonymous Account
      </Button>
    </Dialog>
  );
}

export default CreateAnonymousDialog;
