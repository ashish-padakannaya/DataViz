levels = ['First', 'Second', 'Third', 'Fourth', 'quarter', 'semi', 'Final'];
file = "10yearAUSOpenMatches.csv";
metrics = {
    player1: ['firstServe1','firstPointWon1','secPointWon1','break1','return1'],
    player2: ['firstServe2','firstPointWon2','secPointWon2','break2','return2',]
}

const get_scores = (results) => {
    var p1_score = 0;
    var p2_score = 0;
    removeBracket(results).split(' ').forEach(function (each) {
        if (each === 'ret.') { return }
        scores = each.split('-');
        p1_score += parseInt(scores[0]);
        p2_score += parseInt(scores[1]);
    });
    return [p1_score, p2_score];
}

const getMetrics = (obj) => {
    const p1_metrics = [], p2_metrics = [];
    for(const [player, columns] of Object.entries(metrics)){
        if(player == 'player1'){
            metrics['player1'].forEach((col)=>{ 
                p1_metrics.push(parseInt(obj[col]))
            });
        }
        if(player == 'player2'){
            metrics['player2'].forEach((col)=>{ 
                p2_metrics.push(parseInt(obj[col]))
            });
        }
    }
    return [p1_metrics, p2_metrics];
}

const getTheMoney = (year, stage) => {

    var allPlayers = [];
    var matrix, player_scores = {}, player_colors = [], winner = null;
    return new Promise((resolve, reject) => {

        d3.csv(file, function (error, data) {
            //setting stage number and getting all players
            data.map(function (obj) {
                obj['stage'] = levels.indexOf(obj['round']) + 1;
                if (parseInt(obj['year']) !== year || parseInt(obj['stage']) < stage) { return; }
                allPlayers.push(obj['player1']);
                allPlayers.push(obj['player2']);
                player_scores[obj['player1']] = {};
                player_scores[obj['player2']] = {};
            });
            allPlayers = [...new Set(allPlayers)];
            matrix = zeros(allPlayers.length, allPlayers.length);

            //put scores for the match
            data.map(function (obj) {
                if (parseInt(obj['year']) !== year || parseInt(obj['stage']) < stage) { return; }
                p1 = allPlayers.indexOf(obj['player1']);
                p2 = allPlayers.indexOf(obj['player2']);
                scores = get_scores(obj['results']);
                if(obj['stage'] == 7) { winner = obj['winner'] }

                matrix[p1][p2] = scores[0];
                matrix[p2][p1] = scores[1];
                let [player1_metrics, player2_metrics] = getMetrics(obj)
                record = { 
                    'score': obj['results'], 
                    'game': obj['round'], 
                    'stage': obj['stage'],
                    'player1_metrics': player1_metrics,
                    'player2_metrics': player2_metrics
                };
                player_scores[obj['player1']][obj['player2']] = record;
                player_scores[obj['player2']][obj['player1']] = record;
            });

            //generate player colors
            allPlayers.forEach(function (name) {
                player_colors.push({ 'name': name, 'color': random_rgba() });
            });

            resolve([player_scores, player_colors, matrix, winner]);
        });
    });
}

const getPlayerTimeLine = (name, year) => {
    return new Promise((resolve, reject) => {
        d3.csv(file, function (error, data) {

            //setting stage number and getting all players
            data.map(function (obj) {
                obj['stage'] = levels.indexOf(obj['round']) + 1;
                if (parseInt(obj['year']) !== year) { return; }
            });

            playerData = data.filter((row) => { return (row['player1'] == name || row['player2'] == name) && parseInt(row['year']) == year });
            playerData.sort((a, b) => (a['stage'] > b['stage']) ? 1 : -1)
            var res = []
            var title = "";
            playerData.forEach((obj) => {
                res.push({
                    name: `${obj['winner'] == name ? obj['player2'] : obj['player1']} (${obj['round']})`,
                    label: obj['results'],
                    round: obj['round'],
                    won: obj['winner'] == name,
                    player2: obj['winner'] == name ? obj['player2'] : obj['player1']
                });
            })

            // populate final stage
            var title;
            var finalMatch = res[res.length - 1];
            if (finalMatch['round'] == "Final" && finalMatch['won']) {
                title = `${name} won the tournament`;
            }
            else if (finalMatch['won']) {
                title = `${name} beat ${finalMatch['player2']} in the ${finalMatch['round']} round`;
            }
            else {
                title = `${name} lost to ${finalMatch['player2']} in the ${finalMatch['round']} round`;
            }
            resolve({ title: title, res: res });
        });
    });
}