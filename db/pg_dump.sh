pg_dump -d 'postgres://postgres:dbpass123@localhost:9432/ex-split-bot' --format=c -n "public" --verbose > ex-split-bot-$(date "+%Y%m%d-%H%M%S").dump