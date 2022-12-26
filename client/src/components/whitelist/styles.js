import { makeStyles } from "@material-ui/core/styles"

export default makeStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },

    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },

    deleteButton: {
        edge: 'end',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    

}))