from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from settings import DB_CONFIG

"""
MySQL异步数据库配置
"""

# 构建MySQL连接URL
DATABASE_URL = (
    f"mysql+aiomysql://{DB_CONFIG['user']}:{DB_CONFIG['password']}"
    f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
    f"?charset={DB_CONFIG['charset']}"
)

# 创建异步数据库引擎
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # 设置为 True 可以看到 SQL 语句
    pool_size=20,  # 连接池大小
    max_overflow=10,  # 超过pool_size后最多可以创建的连接数
    pool_timeout=30,  # 池中没有连接时等待的秒数
    pool_recycle=1800,  # 连接重置周期(秒)
)

# 创建异步会话工厂
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# 创建异步基类
class Base(DeclarativeBase):
    pass

# 获取异步数据库会话
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()