import {Stack, Typography} from "@mui/material";


const Footer = () => {
    return(
        <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{mt:5, mb:-2}}
        >
            <Typography variant='body2' color="text.secondary">Copyright © 2024 Kanwil DJPb Prov Sumbar</Typography>
        </Stack>
    )
}

export default Footer;