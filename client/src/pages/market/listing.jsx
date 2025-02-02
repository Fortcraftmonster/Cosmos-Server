import { Box, CircularProgress, Input, InputAdornment, Stack } from "@mui/material";
import { HomeBackground, TransparentHeader } from "../home";
import { useEffect, useState } from "react";
import * as API from "../../api";
import { useTheme } from "@emotion/react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useParams } from "react-router";
import Carousel from 'react-material-ui-carousel'
import { Paper, Button, Chip } from '@mui/material'
import { Link } from "react-router-dom";
import { Link as LinkMUI } from '@mui/material'
import DockerComposeImport from '../servapps/containers/docker-compose';
import { AppstoreAddOutlined, SearchOutlined } from "@ant-design/icons";
import ResponsiveButton from "../../components/responseiveButton";

function Screenshots({ screenshots }) {
  return screenshots.length > 1 ? (
    <Carousel animation="slide" navButtonsAlwaysVisible={false} fullHeightHover="true" swipe={false}>
      {
        screenshots.map((item, i) => <img style={{ maxHeight: '300px', height: '100%', maxWidth: '100%' }} key={i} src={item} />)
      }
    </Carousel>)
    : <img src={screenshots[0]} style={{ maxHeight: '300px', height: '100%', maxWidth: '100%' }} />
}

function Showcases({ showcase, isDark }) {
  return (
    <Carousel animation="slide" navButtonsAlwaysVisible={false} fullHeightHover="true" swipe={false}>
      {
        showcase.map((item, i) => <ShowcasesItem isDark={isDark} key={i} item={item} />)
      }
    </Carousel>
  )
}

function ShowcasesItem({ isDark, item }) {
  return (
    <Paper style={{
      position: 'relative',
      background: 'url(' + item.screenshots[0] + ')',
      height: '31vh',
      backgroundSize: 'auto 100%',
      maxWidth: '120vh',
      margin: 'auto',
    }}>
      <Stack direction="row" spacing={2} style={{ height: '100%', overflow: 'hidden' }} justifyContent="flex-end">
        <Stack direction="column" spacing={2} style={{ height: '100%' }} sx={{
          backgroundColor: isDark ? '#1A2027' : '#fff',
          padding: '20px 100px',
          width: '50%',
          filter: 'drop-shadow(-20px 0px 20px rgba(0, 0, 0, 1))',

          '@media (max-width: 1100px)': {
            width: '70%',
            padding: '20px 40px',
          },

          '@media (max-width: 600px)': {
            width: '80%',
            padding: '20px 20px',
          }
        }}>
          <Stack direction="row" spacing={2}>
            <img src={item.icon} style={{ width: '36px', height: '36px' }} />
            <h2>{item.name}</h2>
          </Stack>
          <p dangerouslySetInnerHTML={{ __html: item.longDescription }} style={{
            overflow: 'hidden',
          }}></p>
          <Stack direction="row" spacing={2} justifyContent="flex-start">
            <div>
              <DockerComposeImport installerInit defaultName={item.name} dockerComposeInit={item.compose} />
            </div>
            <Link to={"/cosmos-ui/market-listing/cosmos-cloud/" + item.name} style={{
              textDecoration: 'none',
            }}>
              <Button className="CheckButton" color="primary" variant="outlined">
                View
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

const appCardStyle = (theme) => ({
  width: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
})

const gridAnim = {
  transition: 'all 0.2s ease',
  opacity: 1,
  transform: 'translateY(0px)',
  '&.MuiGrid2-item--hidden': {
    opacity: 0,
    transform: 'translateY(-20px)',
  },
};

const MarketPage = () => {
  const [apps, setApps] = useState([]);
  const [showcase, setShowcase] = useState([]);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { appName, appStore } = useParams();
  const [search, setSearch] = useState("");

  const backgroundStyle = isDark ? {
    backgroundColor: 'rgb(0,0,0)',
    // borderTop: '1px solid #595959'
  } : {
    backgroundColor: 'rgb(255,255,255)',
    // borderTop: '1px solid rgb(220,220,220)'
  };

  useEffect(() => {
    API.market.list().then((res) => {
      setApps(res.data.all);
      setShowcase(res.data.showcase);
    });
  }, []);

  let openedApp = null;
  if (appName && Object.keys(apps).length > 0) {
    openedApp = apps[appStore].find((app) => app.name === appName);
  }

  return <>
    <HomeBackground />
    <TransparentHeader />
    {openedApp && <Box style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1300,
      backgroundColor: 'rgba(0,0,0,0.5)',
    }}>
      <Link to="/cosmos-ui/market-listing" as={Box}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}></Link>

      <Stack direction="row" spacing={2} style={{ height: '100%' }} justifyContent="flex-end">
        <Stack direction="column" spacing={3} style={{ height: '100%', overflow: "auto" }} sx={{
          backgroundColor: isDark ? '#1A2027' : '#fff',
          padding: '80px 80px',
          width: '100%',
          maxWidth: '800px',
          filter: 'drop-shadow(-20px 0px 20px rgba(0, 0, 0, 1))',

          '@media (max-width: 700px)': {
            padding: '60px 40px',
          },

          '@media (max-width: 500px)': {
            padding: '40px 20px',
          }
        }}>

          <Link to="/cosmos-ui/market-listing" style={{
            textDecoration: 'none',
          }}>
            <Button className="CheckButton" color="primary" variant="outlined">
              Close
            </Button>
          </Link>

          <div style={{ textAlign: 'center' }}>
            <Screenshots screenshots={openedApp.screenshots} />
          </div>

          <Stack direction="row" spacing={2}>
            <img src={openedApp.icon} style={{ width: '36px', height: '36px' }} />
            <h2>{openedApp.name}</h2>
          </Stack>

          <div>
            {openedApp.tags && openedApp.tags.slice(0, 8).map((tag) => <Chip label={tag} />)}
          </div>

          <div>
            {openedApp.supported_architectures && openedApp.supported_architectures.slice(0, 8).map((tag) => <Chip label={tag} />)}
          </div>

          <div>
            <div><strong>repository:</strong> <LinkMUI href={openedApp.repository}>{openedApp.repository}</LinkMUI></div>
            <div><strong>image:</strong> <LinkMUI href={openedApp.image}>{openedApp.image}</LinkMUI></div>
            <div><strong>compose:</strong> <LinkMUI href={openedApp.compose}>{openedApp.compose}</LinkMUI></div>
          </div>

          <div dangerouslySetInnerHTML={{ __html: openedApp.longDescription }}></div>

          <div>
            <DockerComposeImport installerInit defaultName={openedApp.name} dockerComposeInit={openedApp.compose} />
          </div>
        </Stack>
      </Stack>
    </Box>}

    <Stack style={{ position: 'relative' }} spacing={1}>
      <Stack style={{ height: '35vh' }} spacing={1}>
        {(!showcase || !Object.keys(showcase).length) && <Box style={{
          width: '100%',
          height: '100%',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <CircularProgress
            size={100}
          />
        </Box>}
        {showcase && showcase.length > 0 && <Showcases showcase={showcase} isDark={isDark} />}
      </Stack>

      <Stack spacing={1} style={{
        ...backgroundStyle,
        marginLeft: "-24px",
        marginRight: "-24px",
        marginBottom: "-24px",
        minHeight: 'calc(65vh - 80px)',
        padding: '24px',
      }}>
        <h2>Applications</h2>
        <Stack direction="row" spacing={2}>
          <Input placeholder="Search"
            value={search}
            style={{ maxWidth: '400px' }}
            startAdornment={
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            }
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />

          <Link to="/cosmos-ui/servapps/new-service">
            <ResponsiveButton
              variant="contained"
              startIcon={<AppstoreAddOutlined />}
            >Start ServApp</ResponsiveButton>
          </Link>
          <DockerComposeImport refresh={() => { }} />
        </Stack>
        {(!apps || !Object.keys(apps).length) && <Box style={{
          width: '100%',
          height: '100%',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '150px',
        }}>
          <CircularProgress
            size={100}
          />
        </Box>}

        {apps && Object.keys(apps).length > 0 && <Grid2 container spacing={{ xs: 1, sm: 1, md: 2 }}>
          {Object.keys(apps).map(appstore => apps[appstore]
            .filter((app) => {
              if (!search || search.length <= 2) {
                return true;
              }
              return app.name.toLowerCase().includes(search.toLowerCase()) ||
                app.tags.join(' ').toLowerCase().includes(search.toLowerCase());
            })
            .map((app) => {
              return <Grid2 style={{
                ...gridAnim,
                cursor: 'pointer',
              }} xs={12} sm={12} md={6} lg={4} xl={3} key={app.name} item><Link to={"/cosmos-ui/market-listing/" + appstore + "/" + app.name} style={{
                textDecoration: 'none',
              }}>
                  <div key={app.name} style={appCardStyle(theme)}>
                    <Stack spacing={3} direction={'row'} alignItems={'center'} style={{ padding: '0px 15px' }}>
                      <img src={app.icon} style={{ width: 64, height: 64 }} />
                      <Stack spacing={1}>
                        <div style={{ fontWeight: "bold" }}>{app.name}</div>
                        <div style={{
                          height: '40px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'pre-wrap',
                        }}
                        >{app.description}</div>
                        <Stack direction={'row'} spacing={1}>
                          <div style={{
                            fontStyle: "italic", opacity: 0.7,
                            overflow: 'hidden',
                            height: '21px',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'pre-wrap',
                          }}>{app.tags.slice(0, 3).join(", ")}</div>
                        </Stack>
                      </Stack>
                    </Stack>
                  </div>

                </Link>
              </Grid2>
            }))}
        </Grid2>}
      </Stack>
    </Stack>
  </>
};

export default MarketPage;