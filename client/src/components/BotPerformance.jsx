import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Card, CardContent, Typography, Grid,
  CircularProgress, Box, Button
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BotPerformance = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080/performance');
    setWs(websocket);

    websocket.onmessage = (event) => {
      setPerformance(JSON.parse(event.data));
      setLoading(false);
    };

    // Fetch initial data
    fetch('/api/bot-performance')
      .then(res => res.json())
      .then(data => {
        setPerformance(data);
        setLoading(false);
      });

    return () => websocket.close();
  }, []);

  const restartBot = (botId) => {
    ws.send(JSON.stringify({
      type: 'restart-bot',
      botId
    }));
  };

  const chartData = {
    labels: performance?.bots.map(b => b.name) || [],
    datasets: [{
      label: 'ROI (%)',
      data: performance?.bots.map(b => b.roi) || [],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          🤖 Trading Bot Performance
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <div style={{ height: '300px', marginBottom: '2rem' }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: {
                      display: true,
                      text: 'Bot Performance Overview'
                    }
                  }
                }}
              />
            </div>

            <Grid container spacing={3}>
              {performance?.bots.map(bot => (
                <Grid item xs={12} sm={6} md={4} key={bot.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{bot.name}</Typography>
                      <Typography
                        color={bot.roi >= 0 ? 'green' : 'error'}
                        variant="h4"
                      >
                        {bot.roi >= 0 ? '+' : ''}{bot.roi.toFixed(2)}%
                      </Typography>

                      <Grid container spacing={1} mt={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2">Win Rate:</Typography>
                          <Typography variant="body1">
                            {(bot.winRate * 100).toFixed(1)}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Trades:</Typography>
                          <Typography variant="body1">
                            {bot.tradesCount}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Active:</Typography>
                          <Typography variant="body1">
                            {bot.active ? '✅' : '❌'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => restartBot(bot.id)}
                          >
                            Restart
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BotPerformance;
